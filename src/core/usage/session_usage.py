#!/usr/bin/env python3
"""
Claude Session Usage Analyzer for a single file.

Analyzes token usage from a single Claude Code session file (.jsonl).

Usage:
    python session_usage.py <session_id> <path_to_session_file>

Example:
    python session_usage.py 0ea17d53-eae1-4987-9283-85df9276b03a "C:/Users/lukasz.krysik/.claude/projects/C--Users-lukasz-krysik-Desktop-BMAD-MY-REPO-BMAD-METHOD"
"""

import json
import os
import sys
import argparse
from pathlib import Path
from dataclasses import dataclass
from typing import Optional, Iterator

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

    @property
    def total_input(self) -> int:
        """Total input tokens including cache."""
        return (
            self.input_tokens +
            self.cache_creation_input_tokens +
            self.cache_read_input_tokens
        )

    @property
    def total_tokens(self) -> int:
        """Total tokens (input + output)."""
        return self.total_input + self.output_tokens

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

def analyze_file(file_path: Path, verbose: bool = False) -> UsageStats:
    """
    Analyze a single JSONL file, deduplicating usage by requestId.
    """
    stats = UsageStats()
    processed_request_ids = set()
    line_number = 0

    if verbose:
        print("\n--- Processing file line by line (deduplicating by requestId) ---")

    for entry in parse_jsonl_file(file_path):
        line_number += 1
        usage = extract_usage_from_entry(entry)
        request_id = entry.get('requestId')

        # We only care about entries that have both usage and a request ID
        if not (usage and request_id):
            continue

        if request_id not in processed_request_ids:
            processed_request_ids.add(request_id)
            stats.add(usage)

            if verbose:
                print(f"\n[Line {line_number}, New Request ID: {request_id}]")
                print("Processing usage data:")
                print(json.dumps(usage, indent=2))
        else:
            if verbose:
                print(f"\n[Line {line_number}, Duplicate Request ID: {request_id}]")
                print("Skipping already processed usage data.")

    if verbose:
        print("\n--- Finished processing file ---")
        print(f"Total lines parsed: {line_number}")
        print(f"Unique requests with usage data found: {len(processed_request_ids)}")

    # Set the final message count based on unique requests
    stats.message_count = len(processed_request_ids)

    return stats

def format_number(n: int) -> str:
    """Format a number with thousand separators."""
    return f"{n:,}"

def print_stats(stats: UsageStats, file_path: str) -> None:
    """Print usage statistics."""
    print("=" * 60)
    print(f"TOKEN USAGE REPORT FOR: {file_path}")
    print("=" * 60)
    print(f"Input Tokens:        {format_number(stats.input_tokens)}")
    print(f"Output Tokens:       {format_number(stats.output_tokens)}")
    print(f"Cache Creation:      {format_number(stats.cache_creation_input_tokens)}")
    print(f"Cache Read:          {format_number(stats.cache_read_input_tokens)}")
    print(f"Ephemeral 5m:        {format_number(stats.ephemeral_5m_input_tokens)}")
    print(f"Ephemeral 1h:        {format_number(stats.ephemeral_1h_input_tokens)}")
    print("-----------------------------")
    print(f"Total Input:         {format_number(stats.total_input)}")
    print(f"Total Tokens:        {format_number(stats.total_tokens)}")
    print(f"Messages:            {format_number(stats.message_count)}")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(
        description='Analyze token usage from a single Claude session file.'
    )
    parser.add_argument(
        'session_id',
        help='The ID of the session file (e.g., 0ea17d53-eae1-4987-9283-85df9276b03a)'
    )
    parser.add_argument(
        'path',
        help='The directory path containing the session file.'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Show detailed processing information for each message.'
    )

    args = parser.parse_args()

    session_file_path = Path(args.path) / f"{args.session_id}.jsonl"

    if not session_file_path.exists():
        print(f"Error: Session file not found at: {session_file_path}", file=sys.stderr)
        sys.exit(1)
    
    if not session_file_path.is_file():
        print(f"Error: Path is not a file: {session_file_path}", file=sys.stderr)
        sys.exit(1)

    # Analyze session file
    usage_stats = analyze_file(session_file_path, verbose=args.verbose)

    # Output the report
    print_stats(usage_stats, str(session_file_path))


if __name__ == '__main__':
    main()
