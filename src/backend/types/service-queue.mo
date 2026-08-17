module {
  // Status lifecycle of a service request:
  // Diterima (received) -> Dikerjakan (in progress) -> Selesai (done) -> Diambil (picked up)
  public type ServiceStatus = {
    #Diterima;
    #Dikerjakan;
    #Selesai;
    #Diambil;
  };

  public type ServiceRequest = {
    id : Nat;
    name : Text;
    contact : Text;
    deviceType : Text;
    service : Text;
    complaint : Text;
    handoverTime : Text;
    createdAt : Int;
    status : ServiceStatus;
    price : Nat;
  };

  public type StatusSummary = {
    diterima : Nat;
    dikerjakan : Nat;
    selesai : Nat;
    diambil : Nat;
  };

  // Public tracking view — non-sensitive details only, exposed without auth.
  public type ServiceRequestTracking = {
    id : Nat;
    deviceType : Text;
    service : Text;
    status : ServiceStatus;
    handoverTime : Text;
  };

  // Admin-only revenue summary computed from completed/handover repairs.
  public type RevenueSummary = {
    totalRevenue : Nat;
    completedCount : Nat;
    counts : StatusSummary;
  };
};
