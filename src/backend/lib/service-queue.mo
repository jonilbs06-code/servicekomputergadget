import Map "mo:core/Map";
import Types "../types/service-queue";

module {
  public func getRequest(requests : Map.Map<Nat, Types.ServiceRequest>, id : Nat) : ?Types.ServiceRequest {
    requests.get(id);
  };

  public func addRequest(requests : Map.Map<Nat, Types.ServiceRequest>, request : Types.ServiceRequest) {
    requests.add(request.id, request);
  };

  public func updateStatus(requests : Map.Map<Nat, Types.ServiceRequest>, id : Nat, status : Types.ServiceStatus) : Bool {
    switch (requests.get(id)) {
      case (null) { false };
      case (?request) {
        requests.add(id, { request with status = status });
        true;
      };
    };
  };

  public func removeRequest(requests : Map.Map<Nat, Types.ServiceRequest>, id : Nat) {
    requests.remove(id);
  };

  public func listRequests(requests : Map.Map<Nat, Types.ServiceRequest>) : [Types.ServiceRequest] {
    requests.values().toArray();
  };

  public func summarizeByStatus(requests : Map.Map<Nat, Types.ServiceRequest>) : Types.StatusSummary {
    var diterima = 0;
    var dikerjakan = 0;
    var selesai = 0;
    var diambil = 0;
    for (request in requests.values()) {
      switch (request.status) {
        case (#Diterima) { diterima += 1 };
        case (#Dikerjakan) { dikerjakan += 1 };
        case (#Selesai) { selesai += 1 };
        case (#Diambil) { diambil += 1 };
      };
    };
    { diterima; dikerjakan; selesai; diambil };
  };

  // Public tracking lookup — returns non-sensitive details only.
  public func getTrackingView(requests : Map.Map<Nat, Types.ServiceRequest>, id : Nat) : ?Types.ServiceRequestTracking {
    switch (requests.get(id)) {
      case (null) { null };
      case (?request) {
        ?{
          id = request.id;
          deviceType = request.deviceType;
          service = request.service;
          status = request.status;
          handoverTime = request.handoverTime;
        };
      };
    };
  };

  // Admin revenue summary — total revenue from completed/handover repairs and counts per status.
  public func summarizeRevenue(requests : Map.Map<Nat, Types.ServiceRequest>) : Types.RevenueSummary {
    var totalRevenue = 0;
    var completedCount = 0;
    var diterima = 0;
    var dikerjakan = 0;
    var selesai = 0;
    var diambil = 0;
    for (request in requests.values()) {
      switch (request.status) {
        case (#Diterima) { diterima += 1 };
        case (#Dikerjakan) { dikerjakan += 1 };
        case (#Selesai) {
          selesai += 1;
          totalRevenue += request.price;
          completedCount += 1;
        };
        case (#Diambil) {
          diambil += 1;
          totalRevenue += request.price;
          completedCount += 1;
        };
      };
    };
    {
      totalRevenue;
      completedCount;
      counts = { diterima; dikerjakan; selesai; diambil };
    };
  };
};
