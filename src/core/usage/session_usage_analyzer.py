#!/usr/bin/env python3
"""
Claude Session Usage Analyzer

Analyzes token usage from Claude Code session files (.jsonl).
Supports analyzing main session files and their subagents.

Usage:
    python session_usage_analyzer.py <session_path>
    python session_usage_analyzer.py <session_id> --base-dir <path>

Examples:
    python session_usage_analyzer.py /path/to/session.jsonl
    python session_usage_analyzer.py be18c6d0-46c0-4530-bde9-f535ad152abe --base-dir ~/.claude/projects/MyProject
"""

import json
import os
import sys
import argparse
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, Iterator
from datetime import datetime


@dataclass
class UsageStats:
    """Token usage statistics."""
    input_tokens: int = 0
    output_tokens: int = 0
    cache_creation_input_tokens: int = 0
    cache_read_input_tokens: int = 0
    ephemeral_5m_input_tokens: int = 0
    ephemeral_1h_input_tokens: int = 0
    message_count: int = 0

    def add(self, usage: dict) -> None:
        """Add usage from a message."""
        self.input_tokens += usage.get('input_tokens', 0)
        self.output_tokens += usage.get('output_tokens', 0)
        self.cache_creation_input_tokens += usage.get('cache_creation_input_tokens', 0)
        self.cache_read_input_tokens += usage.get('cache_read_input_tokens', 0)

        cache_creation = usage.get('cache_creation', {})
        self.ephemeral_5m_input_tokens += cache_creation.get('ephemeral_5m_input_tokens', 0)
        self.ephemeral_1h_input_tokens += cache_creation.get('ephemeral_1h_input_tokens', 0)

        self.message_count += 1

    def merge(self, other: 'UsageStats') -> None:
        """Merge another UsageStats into this one."""
        self.input_tokens += other.input_tokens
        self.output_tokens += other.output_tokens
        self.cache_creation_input_tokens += other.cache_creation_input_tokens
        self.cache_read_input_tokens += other.cache_read_input_tokens
        self.ephemeral_5m_input_tokens += other.ephemeral_5m_input_tokens
        self.ephemeral_1h_input_tokens += other.ephemeral_1h_input_tokens
        self.message_count += other.message_count

    @property
    def total_input(self) -> int:
        """Total input tokens including cache."""
        return (self.input_tokens +
                self.cache_creation_input_tokens +
                self.cache_read_input_tokens)

    @property
    def total_tokens(self) -> int:
        """Total tokens (input + output)."""
        return self.total_input + self.output_tokens

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'input_tokens': self.input_tokens,
            'output_tokens': self.output_tokens,
            'cache_creation_input_tokens': self.cache_creation_input_tokens,
            'cache_read_input_tokens': self.cache_read_input_tokens,
            'ephemeral_5m_input_tokens': self.ephemeral_5m_input_tokens,
            'ephemeral_1h_input_tokens': self.ephemeral_1h_input_tokens,
            'message_count': self.message_count,
            'total_input': self.total_input,
            'total_tokens': self.total_tokens
        }


@dataclass
class AgentUsage:
    """Usage statistics for a single agent."""
    agent_id: str
    slug: Optional[str] = None
    model: Optional[str] = None
    stats: UsageStats = field(default_factory=UsageStats)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    parent_uuid: Optional[str] = None

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'agent_id': self.agent_id,
            'slug': self.slug,
            'model': self.model,
            'stats': self.stats.to_dict(),
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'duration_seconds': (self.end_time - self.start_time).total_seconds()
                               if self.start_time and self.end_time else None
        }


@dataclass
class SessionUsage:
    """Usage statistics for an entire session."""
    session_id: str
    main_stats: UsageStats = field(default_factory=UsageStats)
    agents: dict = field(default_factory=dict)  # agent_id -> AgentUsage

    @property
    def total_stats(self) -> UsageStats:
        """Get total usage across main session and all agents."""
        total = UsageStats()
        total.merge(self.main_stats)
        for agent in self.agents.values():
            total.merge(agent.stats)
        return total

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            'session_id': self.session_id,
            'main_stats': self.main_stats.to_dict(),
            'agents': {k: v.to_dict() for k, v in self.agents.items()},
            'total_stats': self.total_stats.to_dict(),
            'agent_count': len(self.agents)
        }


def parse_jsonl_file(file_path: Path) -> Iterator[dict]:
    """Parse a JSONL file and yield each line as a dictionary."""
    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError as e:
                print(f"Warning: Failed to parse line {line_num} in {file_path}: {e}",
                      file=sys.stderr)


def extract_usage_from_entry(entry: dict) -> Optional[dict]:
    """Extract usage data from a session entry."""
    message = entry.get('message', {})
    if isinstance(message, dict):
        return message.get('usage')
    return None


def analyze_file(file_path: Path) -> tuple[UsageStats, Optional[str], Optional[str], Optional[str]]:
    """
    Analyze a single JSONL file.

    Returns:
        Tuple of (stats, agent_id, slug, model)
    """
    stats = UsageStats()
    agent_id = None
    slug = None
    model = None

    for entry in parse_jsonl_file(file_path):
        # Extract metadata
        if agent_id is None:
            agent_id = entry.get('agentId')
        if slug is None:
            slug = entry.get('slug')

        # Extract model from message
        message = entry.get('message', {})
        if isinstance(message, dict) and model is None:
            model = message.get('model')

        # Extract and accumulate usage
        usage = extract_usage_from_entry(entry)
        if usage:
            stats.add(usage)

    return stats, agent_id, slug, model


def find_subagent_files(session_path: Path) -> list[Path]:
    """Find all subagent files for a session."""
    subagent_files = []

    # Check for subagents directory
    session_dir = session_path.parent / session_path.stem
    subagents_dir = session_dir / 'subagents'

    if subagents_dir.exists():
        subagent_files.extend(subagents_dir.glob('*.jsonl'))

    # Also check for agent-*.jsonl files in same directory
    parent_dir = session_path.parent
    session_id = session_path.stem

    # Get all agent files that belong to this session
    for agent_file in parent_dir.glob('agent-*.jsonl'):
        # Check if this agent belongs to current session
        try:
            for entry in parse_jsonl_file(agent_file):
                if entry.get('sessionId') == session_id:
                    subagent_files.append(agent_file)
                break  # Only need to check first entry
        except Exception:
            pass

    return list(set(subagent_files))  # Remove duplicates


def analyze_session(session_path: Path, include_subagents: bool = True) -> SessionUsage:
    """
    Analyze a complete session including subagents.

    Args:
        session_path: Path to the main session .jsonl file
        include_subagents: Whether to include subagent analysis

    Returns:
        SessionUsage object with all statistics
    """
    session_id = session_path.stem
    session_usage = SessionUsage(session_id=session_id)

    # Analyze main session file
    stats, _, _, _ = analyze_file(session_path)
    session_usage.main_stats = stats

    # Analyze subagents
    if include_subagents:
        subagent_files = find_subagent_files(session_path)
        for agent_file in subagent_files:
            agent_stats, agent_id, slug, model = analyze_file(agent_file)
            if agent_id is None:
                agent_id = agent_file.stem

            agent_usage = AgentUsage(
                agent_id=agent_id,
                slug=slug,
                model=model,
                stats=agent_stats
            )
            session_usage.agents[agent_id] = agent_usage

    return session_usage


def format_number(n: int) -> str:
    """Format a number with thousand separators."""
    return f"{n:,}"


def print_stats(stats: UsageStats, indent: str = "") -> None:
    """Print usage statistics."""
    print(f"{indent}Input Tokens:        {format_number(stats.input_tokens)}")
    print(f"{indent}Output Tokens:       {format_number(stats.output_tokens)}")
    print(f"{indent}Cache Creation:      {format_number(stats.cache_creation_input_tokens)}")
    print(f"{indent}Cache Read:          {format_number(stats.cache_read_input_tokens)}")
    print(f"{indent}Ephemeral 5m:        {format_number(stats.ephemeral_5m_input_tokens)}")
    print(f"{indent}Ephemeral 1h:        {format_number(stats.ephemeral_1h_input_tokens)}")
    print(f"{indent}-----------------------------")
    print(f"{indent}Total Input:         {format_number(stats.total_input)}")
    print(f"{indent}Total Tokens:        {format_number(stats.total_tokens)}")
    print(f"{indent}Messages:            {format_number(stats.message_count)}")


def print_session_report(session_usage: SessionUsage, verbose: bool = False) -> None:
    """Print a formatted report of session usage."""
    print("=" * 60)
    print(f"SESSION USAGE REPORT: {session_usage.session_id}")
    print("=" * 60)

    print("\n[MAIN SESSION]")
    print_stats(session_usage.main_stats)

    if session_usage.agents:
        print(f"\n[SUBAGENTS] ({len(session_usage.agents)} agents)")
        print("-" * 40)

        if verbose:
            for agent_id, agent in sorted(session_usage.agents.items()):
                print(f"\n  Agent: {agent_id}")
                if agent.slug:
                    print(f"  Slug: {agent.slug}")
                if agent.model:
                    print(f"  Model: {agent.model}")
                print_stats(agent.stats, "    ")
        else:
            # Summary table
            print(f"{'Agent ID':<20} {'Messages':>10} {'Input':>12} {'Output':>12} {'Total':>12}")
            print("-" * 66)
            for agent_id, agent in sorted(session_usage.agents.items()):
                short_id = agent_id[:18] if len(agent_id) > 18 else agent_id
                print(f"{short_id:<20} {agent.stats.message_count:>10} "
                      f"{format_number(agent.stats.total_input):>12} "
                      f"{format_number(agent.stats.output_tokens):>12} "
                      f"{format_number(agent.stats.total_tokens):>12}")

    print("\n" + "=" * 60)
    print("[TOTAL USAGE]")
    print("=" * 60)
    total = session_usage.total_stats
    print_stats(total)

    # Cost estimation (approximate) - Claude Opus pricing per 1M tokens
    print("\n[ESTIMATED COST] (Claude Opus 4.5 pricing)")
    # Standard input: $15/1M, Output: $75/1M
    # Cache write: $18.75/1M (25% more than base input)
    # Cache read: $1.50/1M (90% discount)
    input_cost_per_m = 15.0
    output_cost_per_m = 75.0
    cache_write_cost_per_m = 18.75
    cache_read_cost_per_m = 1.50

    base_input_cost = (total.input_tokens / 1_000_000) * input_cost_per_m
    cache_write_cost = (total.cache_creation_input_tokens / 1_000_000) * cache_write_cost_per_m
    cache_read_cost = (total.cache_read_input_tokens / 1_000_000) * cache_read_cost_per_m
    output_cost = (total.output_tokens / 1_000_000) * output_cost_per_m

    total_input_cost = base_input_cost + cache_write_cost + cache_read_cost
    total_cost = total_input_cost + output_cost

    print(f"Base input:    ${base_input_cost:.4f}")
    print(f"Cache write:   ${cache_write_cost:.4f}")
    print(f"Cache read:    ${cache_read_cost:.4f}")
    print(f"Output:        ${output_cost:.4f}")
    print(f"-----------------------------")
    print(f"TOTAL:         ${total_cost:.4f}")


def analyze_all_sessions(base_dir: Path, include_subagents: bool = True) -> list[SessionUsage]:
    """Analyze all session files in a directory."""
    sessions = []
    # Find all UUID-named .jsonl files (session files have UUID format)
    import re
    uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jsonl$')

    for file_path in base_dir.glob('*.jsonl'):
        if uuid_pattern.match(file_path.name):
            try:
                session = analyze_session(file_path, include_subagents)
                sessions.append(session)
            except Exception as e:
                print(f"Warning: Failed to analyze {file_path}: {e}", file=sys.stderr)

    return sessions


def print_all_sessions_summary(sessions: list[SessionUsage]) -> None:
    """Print summary of all sessions."""
    print("=" * 80)
    print("ALL SESSIONS SUMMARY")
    print("=" * 80)

    # Sort by total tokens descending
    sessions_sorted = sorted(sessions, key=lambda s: s.total_stats.total_tokens, reverse=True)

    print(f"\n{'Session ID':<40} {'Messages':>10} {'Input':>14} {'Output':>12} {'Agents':>8}")
    print("-" * 84)

    grand_total = UsageStats()
    total_agents = 0

    for session in sessions_sorted:
        total = session.total_stats
        grand_total.merge(total)
        total_agents += len(session.agents)

        short_id = session.session_id[:36]
        print(f"{short_id:<40} {total.message_count:>10} "
              f"{format_number(total.total_input):>14} "
              f"{format_number(total.output_tokens):>12} "
              f"{len(session.agents):>8}")

    print("-" * 84)
    print(f"{'TOTAL (' + str(len(sessions)) + ' sessions)':<40} {grand_total.message_count:>10} "
          f"{format_number(grand_total.total_input):>14} "
          f"{format_number(grand_total.output_tokens):>12} "
          f"{total_agents:>8}")

    # Cost calculation
    print("\n[ESTIMATED TOTAL COST] (Claude Opus 4.5 pricing)")
    input_cost_per_m = 15.0
    output_cost_per_m = 75.0
    cache_write_cost_per_m = 18.75
    cache_read_cost_per_m = 1.50

    base_input_cost = (grand_total.input_tokens / 1_000_000) * input_cost_per_m
    cache_write_cost = (grand_total.cache_creation_input_tokens / 1_000_000) * cache_write_cost_per_m
    cache_read_cost = (grand_total.cache_read_input_tokens / 1_000_000) * cache_read_cost_per_m
    output_cost = (grand_total.output_tokens / 1_000_000) * output_cost_per_m
    total_cost = base_input_cost + cache_write_cost + cache_read_cost + output_cost

    print(f"Base input:    ${base_input_cost:.4f}")
    print(f"Cache write:   ${cache_write_cost:.4f}")
    print(f"Cache read:    ${cache_read_cost:.4f}")
    print(f"Output:        ${output_cost:.4f}")
    print(f"-----------------------------")
    print(f"TOTAL:         ${total_cost:.4f}")


def main():
    parser = argparse.ArgumentParser(
        description='Analyze Claude Code session token usage'
    )
    parser.add_argument(
        'session',
        nargs='?',
        help='Path to session .jsonl file, session ID, or directory for --all'
    )
    parser.add_argument(
        '--base-dir', '-b',
        help='Base directory for sessions (when using session ID)'
    )
    parser.add_argument(
        '--all', '-a',
        action='store_true',
        help='Analyze all sessions in directory'
    )
    parser.add_argument(
        '--no-subagents',
        action='store_true',
        help='Do not analyze subagent files'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Show detailed per-agent statistics'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output as JSON'
    )

    args = parser.parse_args()

    # Handle --all mode
    if args.all:
        if args.session and os.path.isdir(args.session):
            base_dir = Path(args.session)
        elif args.base_dir:
            base_dir = Path(args.base_dir)
        else:
            print("Error: --all requires a directory path or --base-dir", file=sys.stderr)
            sys.exit(1)

        sessions = analyze_all_sessions(base_dir, include_subagents=not args.no_subagents)
        if not sessions:
            print("No sessions found.", file=sys.stderr)
            sys.exit(1)

        if args.json:
            print(json.dumps([s.to_dict() for s in sessions], indent=2))
        else:
            print_all_sessions_summary(sessions)
        return

    # Single session mode
    if not args.session:
        parser.print_help()
        sys.exit(1)

    # Determine session path
    if os.path.exists(args.session):
        session_path = Path(args.session)
    elif args.base_dir:
        session_path = Path(args.base_dir) / f"{args.session}.jsonl"
    else:
        # Try default Claude projects directory
        home = Path.home()
        claude_dir = home / '.claude' / 'projects'

        # Search for session file
        session_path = None
        if claude_dir.exists():
            for project_dir in claude_dir.iterdir():
                if project_dir.is_dir():
                    candidate = project_dir / f"{args.session}.jsonl"
                    if candidate.exists():
                        session_path = candidate
                        break

        if session_path is None:
            print(f"Error: Could not find session '{args.session}'", file=sys.stderr)
            print("Try specifying --base-dir or full path", file=sys.stderr)
            sys.exit(1)

    if not session_path.exists():
        print(f"Error: Session file not found: {session_path}", file=sys.stderr)
        sys.exit(1)

    # Analyze session
    session_usage = analyze_session(
        session_path,
        include_subagents=not args.no_subagents
    )

    # Output
    if args.json:
        print(json.dumps(session_usage.to_dict(), indent=2))
    else:
        print_session_report(session_usage, verbose=args.verbose)


if __name__ == '__main__':
    main()
