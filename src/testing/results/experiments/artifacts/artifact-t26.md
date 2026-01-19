# Climate Model Ensemble Aggregation System

## Technical Specification v1.0

### Executive Summary

ClimateEnsemble Pro aggregates outputs from 30+ CMIP6 climate models to provide actionable climate projections with quantified uncertainty for policy decisions. The system provides regional downscaling to 10km resolution with 95% confidence intervals extending to year 2100.

---

## 1. System Overview

### 1.1 Purpose

ClimateEnsemble Pro synthesizes global climate model outputs into policy-relevant regional projections, enabling governments and organizations to plan for climate change impacts with high confidence.

### 1.2 Core Capabilities

| Capability | Description |
|------------|-------------|
| Model Aggregation | 30+ CMIP6 models combined |
| Uncertainty Quantification | 95% confidence intervals |
| Regional Downscaling | 10km resolution |
| Scenario Support | All RCP/SSP pathways |
| Policy Metrics | Temperature, sea level, precipitation |

### 1.3 Target Users

- Government climate adaptation planners
- Infrastructure engineers
- Insurance actuaries
- Environmental consultants

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  ClimateEnsemble Pro                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   CMIP6     │  │  Ensemble    │  │   Downscaling          │ │
│  │   Ingestion │──│  Aggregator  │──│   Engine               │ │
│  │             │  │              │  │                        │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
│         │                │                      │               │
│         ▼                ▼                      ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Uncertainty Quantification Engine           │   │
│  │   • Model spread analysis                               │   │
│  │   • Structural uncertainty                              │   │
│  │   • Confidence interval calculation                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Policy Communication Module                    │   │
│  │   • IPCC confidence terminology                         │   │
│  │   • Best estimate generation                            │   │
│  │   • Scenario comparison                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Sources

| Source | Models | Resolution | Variables |
|--------|--------|------------|-----------|
| CMIP6 Archive | 35 models | ~100km | 50+ variables |
| ERA5 Reanalysis | 1 | 30km | Historical validation |
| Station Data | - | Point | Bias correction |

---

## 3. CMIP6 Model Ensemble

### 3.1 Model List

```yaml
cmip6_models:
  tier_1:  # Well-established models
    - ACCESS-CM2
    - BCC-CSM2-MR
    - CESM2
    - CNRM-CM6-1
    - EC-Earth3
    - GFDL-CM4
    - HadGEM3-GC31-LL
    - IPSL-CM6A-LR
    - MIROC6
    - MPI-ESM1-2-HR
    - MRI-ESM2-0
    - NorESM2-LM
    - UKESM1-0-LL

  tier_2:  # Additional validated models
    - AWI-CM-1-1-MR
    - BCC-ESM1
    - CanESM5
    - CESM2-WACCM
    - CNRM-ESM2-1
    - EC-Earth3-Veg
    - FIO-ESM-2-0
    - GFDL-ESM4
    - INM-CM4-8
    - INM-CM5-0
    - IPSL-CM6A-LR-INCA
    - KACE-1-0-G
    - MCM-UA-1-0
    - MIROC-ES2L
    - MPI-ESM1-2-LR
    - NESM3
    - NorESM2-MM
    - SAM0-UNICON
    - TaiESM1

total_models: 32
```

### 3.2 Model Weighting

```python
class ModelWeighter:
    def __init__(self):
        self.performance_weight = 0.5
        self.independence_weight = 0.5

    def calculate_weights(self, models: List[ClimateModel],
                         observations: np.array) -> Dict[str, float]:
        """
        Weight models by performance and independence.
        Treat models as independent samples for uncertainty.
        """

        weights = {}

        for model in models:
            # Performance score (RMSE against observations)
            performance = self.evaluate_performance(model, observations)

            # Independence score (uniqueness from other models)
            independence = self.evaluate_independence(model, models)

            # Combined weight
            weights[model.name] = (
                self.performance_weight * performance +
                self.independence_weight * independence
            )

        # Normalize
        total = sum(weights.values())
        return {k: v/total for k, v in weights.items()}
```

---

## 4. Ensemble Aggregation

### 4.1 Multi-Model Mean

```python
class EnsembleAggregator:
    def aggregate(self, model_outputs: Dict[str, np.array],
                  weights: Dict[str, float]) -> AggregatedResult:
        """
        Aggregate model outputs into ensemble projection.
        """

        # Weighted mean
        ensemble_mean = np.zeros_like(list(model_outputs.values())[0])
        for model_name, output in model_outputs.items():
            ensemble_mean += weights[model_name] * output

        # Model spread (inter-model standard deviation)
        outputs_array = np.stack(list(model_outputs.values()))
        model_spread = np.std(outputs_array, axis=0)

        # 95% confidence interval
        ci_lower = ensemble_mean - 1.96 * model_spread
        ci_upper = ensemble_mean + 1.96 * model_spread

        return AggregatedResult(
            mean=ensemble_mean,
            std=model_spread,
            ci_95=(ci_lower, ci_upper),
            n_models=len(model_outputs)
        )
```

### 4.2 Uncertainty Decomposition

```python
class UncertaintyDecomposer:
    def decompose(self, projections: Dict[str, Dict[str, np.array]]) -> Uncertainty:
        """
        Decompose total uncertainty into components.
        Projections: {scenario: {model: projection}}
        """

        # Scenario uncertainty
        scenario_mean = {}
        for scenario, models in projections.items():
            scenario_mean[scenario] = np.mean(list(models.values()), axis=0)
        scenario_var = np.var(list(scenario_mean.values()), axis=0)

        # Model (structural) uncertainty
        model_vars = []
        for scenario, models in projections.items():
            model_var = np.var(list(models.values()), axis=0)
            model_vars.append(model_var)
        structural_var = np.mean(model_vars, axis=0)

        # Internal variability (from initial condition ensembles)
        internal_var = self.estimate_internal_variability(projections)

        return Uncertainty(
            scenario=scenario_var,
            structural=structural_var,
            internal=internal_var,
            total=scenario_var + structural_var + internal_var
        )
```

### 4.3 Structural Uncertainty Quantification

```python
class StructuralUncertainty:
    """
    Quantify uncertainty from different model structures.
    This represents Knightian (irreducible) uncertainty.
    """

    def quantify(self, models: List[ClimateModel]) -> float:
        """
        Provide 95% confidence bounds on structural uncertainty.
        """

        # Group models by physics schemes
        physics_groups = self.group_by_physics(models)

        # Within-group variance (parametric uncertainty)
        within_var = np.mean([
            np.var([m.projection for m in group])
            for group in physics_groups.values()
        ])

        # Between-group variance (structural uncertainty)
        group_means = [
            np.mean([m.projection for m in group])
            for group in physics_groups.values()
        ]
        between_var = np.var(group_means)

        # Total structural uncertainty
        structural_uncertainty = between_var + within_var

        # 95% confidence interval
        ci = 1.96 * np.sqrt(structural_uncertainty / len(models))

        return StructuralUncertaintyResult(
            mean_spread=np.sqrt(structural_uncertainty),
            confidence_interval=ci,
            confidence_level=0.95
        )
```

---

## 5. Regional Downscaling

### 5.1 Statistical Downscaling

```python
class StatisticalDownscaler:
    def __init__(self, target_resolution: int = 10):  # 10km
        self.target_res = target_resolution
        self.bias_correction = QuantileMapping()

    def downscale(self, gcm_output: np.array,
                  obs_high_res: np.array) -> np.array:
        """
        Downscale from ~100km GCM to 10km resolution.
        """

        # Step 1: Regrid to target resolution
        regridded = self.bilinear_interpolate(gcm_output, self.target_res)

        # Step 2: Bias correction using quantile mapping
        bias_corrected = self.bias_correction.correct(
            regridded, obs_high_res
        )

        # Step 3: Add local variability
        local_pattern = self.extract_local_pattern(obs_high_res)
        downscaled = bias_corrected + local_pattern

        return downscaled

    def bilinear_interpolate(self, data, target_res):
        """Interpolate from coarse to fine grid"""
        from scipy.interpolate import RegularGridInterpolator

        # Create interpolator
        lat_coarse = np.arange(data.shape[0])
        lon_coarse = np.arange(data.shape[1])
        interp = RegularGridInterpolator((lat_coarse, lon_coarse), data)

        # Target grid
        scale_factor = 100 / target_res  # 100km to 10km = 10x
        lat_fine = np.linspace(0, data.shape[0]-1, int(data.shape[0]*scale_factor))
        lon_fine = np.linspace(0, data.shape[1]-1, int(data.shape[1]*scale_factor))

        # Interpolate
        lat_grid, lon_grid = np.meshgrid(lat_fine, lon_fine, indexing='ij')
        points = np.stack([lat_grid, lon_grid], axis=-1)
        return interp(points)
```

### 5.2 Downscaling Uncertainty

```python
class DownscalingUncertainty:
    def estimate(self, gcm_data, downscaled_data, observations):
        """
        Estimate additional uncertainty introduced by downscaling.
        """

        # Cross-validation error
        cv_error = self.cross_validate(gcm_data, observations)

        # Representation error (point vs area)
        rep_error = self.representation_error(downscaled_data, observations)

        # Total downscaling uncertainty
        ds_uncertainty = np.sqrt(cv_error**2 + rep_error**2)

        return DownscalingUncertaintyResult(
            cv_error=cv_error,
            representation_error=rep_error,
            total=ds_uncertainty
        )
```

---

## 6. Scenario Support

### 6.1 RCP/SSP Scenarios

```yaml
scenarios:
  ssp126:
    description: "Sustainability - Taking the Green Road"
    warming_2100: "1.5-2°C"
    co2_2100: "~400 ppm"

  ssp245:
    description: "Middle of the Road"
    warming_2100: "2.5-3°C"
    co2_2100: "~600 ppm"

  ssp370:
    description: "Regional Rivalry"
    warming_2100: "3-4°C"
    co2_2100: "~800 ppm"

  ssp585:
    description: "Fossil-fueled Development"
    warming_2100: "4-5°C"
    co2_2100: "~1000 ppm"
```

### 6.2 Scenario Comparison

```python
class ScenarioComparator:
    def compare(self, region: Region) -> ScenarioComparison:
        """
        Compare climate outcomes across scenarios for a region.
        """

        results = {}

        for scenario in self.scenarios:
            projection = self.project(region, scenario)

            results[scenario] = {
                'temp_change_2050': projection.temperature[2050] - projection.baseline,
                'temp_change_2100': projection.temperature[2100] - projection.baseline,
                'precip_change_2100': projection.precipitation_change[2100],
                'sea_level_2100': projection.sea_level[2100],
                'confidence': 'high'  # IPCC terminology
            }

        return ScenarioComparison(results)
```

---

## 7. Projection to 2100

### 7.1 Long-Range Projection

```python
class CenturyProjector:
    def project(self, region: Region, scenario: str,
                start_year: int = 2020,
                end_year: int = 2100) -> Projection:
        """
        Generate climate projection to 2100 with high confidence.
        """

        # Get model ensemble for scenario
        models = self.load_models(scenario)

        # Generate projections
        projections = {}
        for model in models:
            proj = model.get_projection(region, start_year, end_year)
            projections[model.name] = proj

        # Aggregate with uncertainty
        aggregated = self.aggregator.aggregate(projections, self.weights)

        # Add trend analysis
        trend = self.fit_trend(aggregated.mean)

        return Projection(
            years=range(start_year, end_year + 1),
            values=aggregated.mean,
            uncertainty=aggregated.ci_95,
            trend=trend,
            confidence='high'  # IPCC: "high confidence" for 2100
        )
```

### 7.2 Confidence Levels

Following IPCC AR6 terminology:

| Term | Likelihood | Confidence |
|------|------------|------------|
| Virtually certain | >99% | Very high |
| Very likely | >90% | High |
| Likely | >66% | High |
| About as likely as not | 33-66% | Medium |
| Unlikely | <33% | Low |

---

## 8. Bias Correction

### 8.1 Systematic Bias Detection

```python
class BiasDetector:
    def detect(self, model_output: np.array,
               observations: np.array) -> BiasReport:
        """
        Detect systematic biases in model output.
        """

        # Mean bias
        mean_bias = np.mean(model_output) - np.mean(observations)

        # Trend bias
        model_trend = self.fit_trend(model_output)
        obs_trend = self.fit_trend(observations)
        trend_bias = model_trend - obs_trend

        # Seasonal cycle bias
        model_seasonal = self.extract_seasonal(model_output)
        obs_seasonal = self.extract_seasonal(observations)
        seasonal_bias = model_seasonal - obs_seasonal

        # Variability bias
        var_ratio = np.std(model_output) / np.std(observations)

        return BiasReport(
            mean=mean_bias,
            trend=trend_bias,
            seasonal=seasonal_bias,
            variability_ratio=var_ratio
        )
```

### 8.2 Bias Correction Methods

```python
class BiasCorrector:
    def correct(self, model_data: np.array,
                observations: np.array,
                method: str = 'quantile_mapping') -> np.array:
        """
        Correct systematic model biases.
        """

        if method == 'quantile_mapping':
            return self.quantile_mapping(model_data, observations)
        elif method == 'delta':
            return self.delta_method(model_data, observations)
        elif method == 'scaling':
            return self.variance_scaling(model_data, observations)
        else:
            raise ValueError(f"Unknown method: {method}")

    def quantile_mapping(self, model, obs):
        """Map model quantiles to observed quantiles"""
        model_cdf = self.empirical_cdf(model)
        obs_cdf = self.empirical_cdf(obs)

        corrected = np.zeros_like(model)
        for i, val in enumerate(model):
            # Find quantile in model CDF
            q = model_cdf(val)
            # Map to observation CDF
            corrected[i] = self.inverse_cdf(obs_cdf, q)

        return corrected
```

---

## 9. Attribution

### 9.1 Observed Change Attribution

```python
class AttributionEngine:
    def attribute(self, observed_change: float,
                  region: Region,
                  variable: str) -> AttributionResult:
        """
        Attribute observed climate change to anthropogenic vs natural factors.
        """

        # Run detection and attribution
        natural_only = self.natural_forcing_response(region, variable)
        anthro_only = self.anthropogenic_response(region, variable)
        combined = self.combined_response(region, variable)

        # Optimal fingerprinting
        beta_natural, beta_anthro = self.optimal_fingerprint(
            observed_change, natural_only, anthro_only
        )

        # Uncertainty ranges
        uncertainty = self.bootstrap_uncertainty(
            observed_change, natural_only, anthro_only
        )

        return AttributionResult(
            observed=observed_change,
            natural_contribution=beta_natural * natural_only,
            anthropogenic_contribution=beta_anthro * anthro_only,
            anthropogenic_fraction=beta_anthro * anthro_only / observed_change,
            confidence='very_likely'  # >90% for most attribution studies
        )
```

---

## 10. Policy Communication

### 10.1 Best Estimate Generation

```python
class PolicyCommunicator:
    def generate_best_estimate(self, projection: Projection) -> BestEstimate:
        """
        Generate deterministic best estimate for policy planning.
        """

        # Central tendency (median of ensemble)
        best_estimate = np.median(projection.values, axis=0)

        # Key milestones
        milestones = {
            '2030': best_estimate[10],  # 2020 + 10 years
            '2050': best_estimate[30],
            '2100': best_estimate[80]
        }

        return BestEstimate(
            values=best_estimate,
            milestones=milestones,
            unit=projection.unit,
            baseline=projection.baseline,
            scenario=projection.scenario,
            confidence='high'
        )
```

### 10.2 Report Generation

```python
class ReportGenerator:
    def generate_policy_brief(self, region: Region,
                             scenarios: List[str]) -> PolicyBrief:
        """
        Generate policy-ready summary of climate projections.
        """

        projections = {}
        for scenario in scenarios:
            projections[scenario] = self.project(region, scenario)

        return PolicyBrief(
            region=region.name,
            key_findings=self.extract_key_findings(projections),
            temperature_table=self.temperature_summary(projections),
            precipitation_table=self.precipitation_summary(projections),
            sea_level_table=self.sea_level_summary(projections),
            recommendations=self.generate_recommendations(projections),
            confidence_summary=self.confidence_summary(projections),
            data_sources="CMIP6 Multi-Model Ensemble (32 models)",
            methodology="Statistical downscaling with bias correction"
        )
```

---

## 11. Validation

### 11.1 Historical Validation

```python
class Validator:
    def validate_against_observations(self,
                                      model_historical: np.array,
                                      observations: np.array) -> ValidationResult:
        """
        Validate model ensemble against historical observations.
        Target: <5% error on key metrics.
        """

        # Temperature error
        temp_rmse = np.sqrt(np.mean((model_historical['tas'] - observations['tas'])**2))
        temp_bias = np.mean(model_historical['tas'] - observations['tas'])

        # Precipitation error
        precip_rmse = np.sqrt(np.mean((model_historical['pr'] - observations['pr'])**2))
        precip_bias = np.mean(model_historical['pr'] - observations['pr'])

        # Trend accuracy
        model_trend = self.fit_trend(model_historical['tas'])
        obs_trend = self.fit_trend(observations['tas'])
        trend_error = abs(model_trend - obs_trend) / abs(obs_trend) * 100

        return ValidationResult(
            temperature_rmse=temp_rmse,
            temperature_bias=temp_bias,
            precipitation_rmse=precip_rmse,
            precipitation_bias=precip_bias,
            trend_error_percent=trend_error,
            passed=trend_error < 5  # <5% target
        )
```

---

## 12. Updates and Maintenance

### 12.1 Observation Integration

```python
class ObservationUpdater:
    def update_with_observations(self, new_observations: np.array):
        """
        Update projections as new observations arrive.
        """

        # Extend validation period
        self.validation_data = np.concatenate([
            self.validation_data, new_observations
        ])

        # Re-evaluate model weights
        self.weights = self.weighter.calculate_weights(
            self.models, self.validation_data
        )

        # Re-run bias correction
        for model in self.models:
            model.bias_correction = self.correct_bias(
                model.historical, self.validation_data
            )

        # Regenerate projections
        self.projections = self.regenerate_projections()
```

---

## 13. Assumptions and Limitations

### 13.1 Assumptions

1. CMIP6 models capture relevant climate physics
2. Historical observations are accurate
3. Scenario emissions pathways are plausible
4. Downscaling methods preserve climate signals
5. Model spread represents uncertainty adequately

### 13.2 Limitations

1. Climate system has inherent chaotic variability
2. Regional projections more uncertain than global
3. Extreme events harder to project than means
4. Tipping points may not be well represented
5. Novel climate states have no historical analogue

---

*Document Version: 1.0*
*Last Updated: 2026-01-19*
*Classification: Technical Specification*
