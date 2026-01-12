# Natural Language to Method Mapping (T15) - Design Document

## Executive Summary

This document presents a comprehensive design for a Natural Language to Method Mapping system that translates user intent expressed in free-form text into appropriate verification methods from a structured method registry. The system supports multi-language input, learns user preferences, handles ambiguity gracefully, and provides transparent reasoning for its selections.

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NL-to-Method Mapping System                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │   Language   │───▶│    Intent    │───▶│    Method    │───▶│  Response │ │
│  │  Detection   │    │   Parsing    │    │   Matching   │    │ Generator │ │
│  │  & Normalize │    │   Engine     │    │   Algorithm  │    │           │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └───────────┘ │
│         │                   │                   │                   │       │
│         ▼                   ▼                   ▼                   ▼       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Shared Knowledge Layer                          │  │
│  ├──────────────┬──────────────┬──────────────┬─────────────────────────┤  │
│  │   Synonym    │    Method    │    User      │      Explanation        │  │
│  │   Registry   │   Catalog    │ Preferences  │      Templates          │  │
│  └──────────────┴──────────────┴──────────────┴─────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Responsibilities

| Component | Primary Responsibility | Interfaces |
|-----------|----------------------|------------|
| Language Detection & Normalize | Detect input language, normalize to canonical form | Input: raw text; Output: normalized tokens + language code |
| Intent Parsing Engine | Extract structured intent from natural language | Input: normalized tokens; Output: IntentStructure |
| Method Matching Algorithm | Map intent to methods with confidence scores | Input: IntentStructure; Output: MethodSelection[] |
| Response Generator | Create human-readable explanations and clarifications | Input: MethodSelection[]; Output: formatted response |
| Synonym Registry | Maintain cross-language term equivalencies | Lookup API for term normalization |
| Method Catalog | Structured access to methods.csv data | Query API for method metadata |
| User Preferences | Track and apply learned user patterns | Read/write API for preference storage |

---

## 2. Detailed Component Designs

### 2.1 Language Detection & Normalization

#### 2.1.1 Supported Languages

| Language | Code | Priority | Coverage |
|----------|------|----------|----------|
| English | en | Primary | Full |
| Polish | pl | Primary | Full |

#### 2.1.2 Detection Strategy

```
Algorithm: DetectLanguage(input_text)
─────────────────────────────────────────
1. Character Analysis:
   - Check for Polish-specific characters: ą, ć, ę, ł, ń, ó, ś, ź, ż
   - Presence strongly indicates Polish

2. Stop Word Frequency:
   - English stops: the, is, are, to, for, with, not, don't
   - Polish stops: jest, są, do, dla, z, nie, czy

3. N-gram Analysis:
   - Compare trigram frequencies against language profiles

4. Confidence Threshold:
   - If confidence < 0.7, attempt bilingual processing
   - If confidence < 0.4, request language clarification

5. Return: { language_code, confidence, alternate_interpretation }
```

#### 2.1.3 Normalization Pipeline

```
Pipeline: NormalizeInput(text, language_code)
─────────────────────────────────────────────
Step 1: Unicode Normalization (NFC form)
Step 2: Case Folding (preserve acronyms)
Step 3: Tokenization (language-aware)
Step 4: Lemmatization (reduce to base forms)
Step 5: Synonym Expansion (see Section 2.4)
Step 6: Intent Marker Identification

Output: NormalizedInput {
  original_text: string
  language: LanguageCode
  tokens: Token[]
  intent_markers: IntentMarker[]
  negations: NegationSpan[]
}
```

### 2.2 Intent Parsing Engine

#### 2.2.1 Intent Structure Definition

```typescript
interface IntentStructure {
  // Primary verification goal
  primary_action: ActionType;

  // What is being verified
  target_domains: Domain[];

  // Constraints and modifiers
  constraints: Constraint[];

  // Explicit exclusions (negations)
  exclusions: Exclusion[];

  // Composition requests
  compositions: CompositionRequest[];

  // Confidence in parsing
  parsing_confidence: number;

  // Ambiguities requiring clarification
  ambiguities: Ambiguity[];
}

type ActionType =
  | 'verify'      // Check correctness
  | 'validate'    // Confirm against criteria
  | 'analyze'     // Deep examination
  | 'audit'       // Formal review
  | 'check'       // Quick assessment
  | 'assess'      // Evaluate quality
  | 'review'      // Human-oriented examination
  | 'test'        // Execute tests
  | 'ensure'      // Guarantee properties
  | 'confirm';    // Validate assumptions

type Domain =
  | 'security'
  | 'performance'
  | 'correctness'
  | 'architecture'
  | 'code_quality'
  | 'documentation'
  | 'testing'
  | 'compliance'
  | 'accessibility'
  | 'maintainability';
```

### 2.3 Method Matching Algorithm

#### 2.3.1 Matching Algorithm

```
Algorithm: MatchMethods(intent, user_preferences, method_catalog)
─────────────────────────────────────────────────────────────────
Input:
  - intent: IntentStructure
  - user_preferences: UserPreferences
  - method_catalog: Method[]
Output:
  - MethodSelection[]

1. INITIAL FILTERING (Exclusions):
   candidate_methods = method_catalog.filter(method =>
     !intent.exclusions.any(excl => method.matches(excl))
   )

2. DOMAIN MATCHING:
   for each method in candidate_methods:
     domain_score = CalculateDomainOverlap(
       method.applicable_domains,
       intent.target_domains
     )
     method.scores.domain = domain_score

3. ACTION COMPATIBILITY:
   for each method in candidate_methods:
     action_score = CalculateActionFit(
       method.category,
       intent.primary_action
     )
     method.scores.action = action_score

4. KEYWORD MATCHING:
   query_terms = ExtractKeyTerms(intent)
   for each method in candidate_methods:
     keyword_score = CalculateKeywordSimilarity(
       method.keywords ∪ method.keywords_pl,
       query_terms
     )
     method.scores.keyword = keyword_score

5. PREFERENCE BOOSTING:
   for each method in candidate_methods:
     preference_boost = user_preferences.getBoost(method.id)
     method.scores.preference = preference_boost

6. FINAL SCORING:
   for each method in candidate_methods:
     final_score = WeightedSum(
       domain:     0.35,
       action:     0.25,
       keyword:    0.20,
       preference: 0.15,
       recency:    0.05
     )
     method.final_score = final_score

7. SELECTION:
   sorted_methods = SortByScore(candidate_methods, descending)

   if intent.parsing_confidence >= HIGH_CONFIDENCE:
     return top(sorted_methods, n=1)
   else if intent.parsing_confidence >= MEDIUM_CONFIDENCE:
     return top(sorted_methods, n=3)
   else:
     return RequestClarification(intent.ambiguities)
```

### 2.4 Synonym Registry

#### 2.4.1 Core Synonym Mappings

**Action Synonyms (English):**

| Canonical | Synonyms | Weight |
|-----------|----------|--------|
| verify | check, validate, confirm, ensure, make sure | 0.9-1.0 |
| analyze | examine, inspect, investigate, look into, deep dive | 0.85-0.95 |
| review | audit, assess, evaluate, appraise | 0.8-0.9 |
| test | try, run tests, execute tests, QA | 0.9-1.0 |

**Action Synonyms (Polish):**

| Canonical | Synonyms | Weight |
|-----------|----------|--------|
| zweryfikuj | sprawdź, potwierdź, upewnij się | 0.9-1.0 |
| analizuj | zbadaj, przeanalizuj, sprawdź dokładnie | 0.85-0.95 |
| przejrzyj | oceń, sprawdź, przeanalizuj | 0.8-0.9 |
| testuj | przetestuj, uruchom testy, sprawdź działanie | 0.9-1.0 |

### 2.5 User Preferences Learning

#### 2.5.1 Preference Data Model

```typescript
interface UserPreferences {
  user_id: string;
  created_at: timestamp;
  updated_at: timestamp;

  // Explicit preferences
  preferred_methods: MethodPreference[];
  excluded_methods: string[];
  preferred_language: LanguageCode;

  // Learned patterns
  usage_history: UsageRecord[];
  domain_affinities: DomainAffinity[];
  composition_patterns: CompositionPattern[];

  // Behavioral signals
  clarification_tolerance: number;
  explanation_detail: 'brief' | 'standard' | 'detailed';
}
```

#### 2.5.2 Learning Algorithm

```
Algorithm: UpdatePreferences(user_id, interaction)
─────────────────────────────────────────────────
1. RECORD INTERACTION:
   preferences = LoadPreferences(user_id)
   preferences.usage_history.append(UsageRecord(interaction))

2. UPDATE METHOD AFFINITY:
   if interaction.selected_method:
     if was_top_suggestion(method, interaction.suggested_methods):
       preferences.preferred_methods[method].boost_factor *= 1.05
     else:
       DecreaseBoost(interaction.suggested_methods[0])
       IncreaseBoost(method)

3. UPDATE DOMAIN AFFINITY:
   selected_domains = GetDomains(interaction.selected_method)
   for domain in selected_domains:
     preferences.domain_affinities[domain].score += AFFINITY_INCREMENT

4. PERSIST:
   SavePreferences(user_id, preferences)
```

### 2.6 Ambiguity Handling

#### 2.6.1 Ambiguity Types

| Type | Description | Resolution Strategy |
|------|-------------|---------------------|
| Domain Ambiguity | Unclear which domain user means | Ask with examples |
| Method Ambiguity | Multiple methods equally valid | Present options |
| Action Ambiguity | Unclear what user wants to do | Clarify with paraphrase |
| Scope Ambiguity | Unclear how thorough | Offer quick vs. deep options |

### 2.7 Negation Processing

#### 2.7.1 Negation Patterns

**English Negation Patterns:**
```
Pattern                     | Example
──────────────────────────────────────────────────────
"don't" + verb              | "don't use security methods"
"not" + noun/method         | "not first principles"
"without" + noun            | "without performance analysis"
"except" + noun             | "everything except documentation"
```

**Polish Negation Patterns:**
```
Pattern                     | Example
──────────────────────────────────────────────────────
"nie" + verb                | "nie używaj metod bezpieczeństwa"
"bez" + noun                | "bez analizy wydajności"
"oprócz" + noun             | "wszystko oprócz dokumentacji"
```

### 2.8 Method Composition

#### 2.8.1 Composition Patterns

| Pattern | Example | Interpretation |
|---------|---------|----------------|
| Sequential | "first A then B" | Run A, use results for B |
| Parallel | "A and B together" | Run both, merge results |
| Conditional | "A, then B if needed" | Run A, B only if A flags issues |
| Weighted | "mainly A with some B" | Prioritize A, supplement with B |

### 2.9 Graceful Degradation Strategy

```
Algorithm: GracefulDegradation(intent, method_catalog)
─────────────────────────────────────────────────────
When no good match exists:

Level 1 - Broaden Search:
  - Remove most specific constraints
  - Expand domain matching to related domains
  - Try partial keyword matches

Level 2 - Suggest Alternatives:
  - Find methods with highest partial overlap
  - Explain why full match wasn't possible
  - Offer to relax specific requirements

Level 3 - Generic Fallback:
  - Suggest general-purpose verification methods
  - Offer to help reformulate the request
  - Log for future method catalog expansion

Level 4 - Human Escalation:
  - Acknowledge limitation
  - Provide what partial matches exist
  - Request human guidance
```

---

## 3. Assumptions

| # | Assumption | Impact if Wrong | Mitigation |
|---|------------|-----------------|------------|
| A1 | methods.csv contains structured method data with categories, domains, and keywords | System cannot function | Configuration validation at startup |
| A2 | Users have persistent identifiers for preference learning | No personalization | Support anonymous mode |
| A3 | Method catalog is relatively stable | Stale cache issues | Implement cache invalidation |
| A4 | Users primarily interact in English or Polish | Reduced accuracy | Implement code-switching detection |
| A5 | Most requests involve 1-3 methods | Performance tuning may be off | Benchmark with actual usage |

---

## 4. Edge Cases & Failure Modes

| Edge Case | Detection | Handling |
|-----------|-----------|----------|
| Empty input | Length check | "What would you like to verify?" |
| Only negations | All methods excluded | "You've excluded all matching methods. Could you tell me what you'd like to include?" |
| Contradictory request | Conflict detection | "I noticed you want both {X} and {Y}, which are conflicting. Which is more important?" |
| Unknown domain | No keyword matches | Graceful degradation + clarification |
| All methods equally scored | Score clustering | Present top 3 with differences |
| Very long input | Token limit | Extract key sentences, summarize |
| Mixed languages | Both detected | Process in dominant language |
| Typos/misspellings | Fuzzy matching | Apply edit distance, suggest correction |

---

## 5. Implementation Guidance

### 5.1 Recommended Implementation Order

```
Phase 1 - Core Pipeline (MVP):
  1. Basic language detection (heuristic-based)
  2. Simple tokenization and normalization
  3. Keyword-based method matching
  4. Single method selection

Phase 2 - Intent Understanding:
  5. Full intent parsing with action/domain extraction
  6. Negation processing
  7. Ambiguity detection and clarification
  8. Explanation generation

Phase 3 - Advanced Features:
  9. Composition support
  10. User preference learning
  11. Graceful degradation
  12. Full bilingual support

Phase 4 - Optimization:
  13. Performance tuning
  14. Edge case hardening
  15. A/B testing infrastructure
```

---

## 6. Limitations

1. No support for languages beyond English and Polish without extension
2. Preference learning requires multiple interactions to be effective
3. Cannot handle entirely novel verification requests not represented in method catalog
4. Ambiguity resolution depends on user willingness to clarify
5. Method composition may produce unexpected results for incompatible methods
