declare type MetricsOptionsCommon = {
    globalLabels?: Record<string, string>;
};
export declare type MetricsOptionsJson = {
    format: 'json';
} & MetricsOptionsCommon;
export declare type MetricsOptionsPrometheus = {
    format: 'prometheus';
} & MetricsOptionsCommon;
export declare type EngineMetricsOptions = MetricsOptionsJson | MetricsOptionsPrometheus;
export declare type Metrics = {
    counters: Metric<number>[];
    gauges: Metric<number>[];
    histograms: Metric<MetricHistogram>[];
};
export declare type Metric<T> = {
    key: string;
    value: T;
    labels: Record<string, string>;
    description: string;
};
export declare type MetricHistogramBucket = [maxValue: number, count: number];
export declare type MetricHistogram = {
    buckets: MetricHistogramBucket[];
    sum: number;
    count: number;
};
export {};
