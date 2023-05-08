package executor

type MetricType string

const (
	// Counter is single additive value. New values are simply added to the current one.
	Counter MetricType = "counter"
	// Histogram is a set of numerical values that quantify a distribution of values. New values are added to the distribution.
	Histogram = "histogram"
	// Gauge is a single non-additive value. New value replaces the previous one.
	Gauge = "gauge"
)

type Metric struct {
	Title string
	Type  MetricType
}

type Graph struct {
	Title   string
	Unit    string
	Metrics []Metric
}

type Group struct {
	Name   string
	Graphs []Graph
}

type HistogramValues struct {
	Count  int64   `protobuf:"varint,1,opt,name=count,proto3" json:"count,omitempty"`
	Min    int64   `protobuf:"varint,2,opt,name=min,proto3" json:"min,omitempty"`
	Max    int64   `protobuf:"varint,3,opt,name=max,proto3" json:"max,omitempty"`
	Mean   float64 `protobuf:"fixed64,4,opt,name=mean,proto3" json:"mean,omitempty"`
	Stddev float64 `protobuf:"fixed64,5,opt,name=stddev,proto3" json:"stddev,omitempty"`
	Median float64 `protobuf:"fixed64,6,opt,name=median,proto3" json:"median,omitempty"`
	P75    float64 `protobuf:"fixed64,7,opt,name=p75,proto3" json:"p75,omitempty"`
	P95    float64 `protobuf:"fixed64,8,opt,name=p95,proto3" json:"p95,omitempty"`
	P99    float64 `protobuf:"fixed64,9,opt,name=p99,proto3" json:"p99,omitempty"`
	P999   float64 `protobuf:"fixed64,10,opt,name=p999,proto3" json:"p999,omitempty"`
}

type BasedReqMetric struct {
	AppID string `protobuf:"varint,1,opt,name=appID,proto3" json:"appID,omitempty"` // app ID
	EID   string `protobuf:"bytes,2,opt,name=eID,proto3" json:"eID,omitempty"`      // executor ID
	MID   int64  `protobuf:"varint,3,opt,name=mID,proto3" json:"mID,omitempty"`     // metric ID
	Time  int64  `protobuf:"varint,4,opt,name=time,proto3" json:"time,omitempty"`
}

type CounterReq struct {
	Base  *BasedReqMetric `protobuf:"bytes,1,opt,name=base,proto3" json:"base,omitempty"`
	Count int64           `protobuf:"varint,2,opt,name=count,proto3" json:"count,omitempty"`
}

type GaugeReq struct {
	Base  *BasedReqMetric `protobuf:"bytes,1,opt,name=base,proto3" json:"base,omitempty"`
	Gauge int64           `protobuf:"varint,2,opt,name=gauge,proto3" json:"gauge,omitempty"`
}
