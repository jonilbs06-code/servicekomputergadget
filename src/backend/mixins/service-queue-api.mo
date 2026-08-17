import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/service-queue";
import ServiceQueueLib "../lib/service-queue";

mixin (
  requests : Map.Map<Nat, Types.ServiceRequest>,
  nextRequestId : { var next : Nat },
  accessControlState : AccessControl.AccessControlState,
) {
  public shared func submitServiceRequest(
    name : Text,
    contact : Text,
    deviceType : Text,
    service : Text,
    complaint : Text,
    handoverTime : Text,
    price : Nat,
  ) : async Nat {
    if (name == "" or contact == "") {
      Runtime.trap("Name and contact details are required");
    };

    let request : Types.ServiceRequest = {
      id = nextRequestId.next;
      name;
      contact;
      deviceType;
      service;
      complaint;
      handoverTime;
      createdAt = Time.now();
      status = #Diterima;
      price;
    };

    ServiceQueueLib.addRequest(requests, request);
    nextRequestId.next += 1;
    request.id;
  };

  public shared query ({ caller }) func listServiceRequests() : async [Types.ServiceRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    ServiceQueueLib.listRequests(requests);
  };

  public shared ({ caller }) func setServiceRequestStatus(id : Nat, status : Types.ServiceStatus) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    ServiceQueueLib.updateStatus(requests, id, status);
  };

  public shared ({ caller }) func deleteServiceRequest(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    ServiceQueueLib.removeRequest(requests, id);
  };

  public shared query ({ caller }) func getServiceRequestStatusSummary() : async Types.StatusSummary {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    ServiceQueueLib.summarizeByStatus(requests);
  };

  // Public tracking lookup — no authentication required.
  public shared query func getServiceRequestTracking(id : Nat) : async ?Types.ServiceRequestTracking {
    ServiceQueueLib.getTrackingView(requests, id);
  };

  // Admin-only revenue summary.
  public shared query ({ caller }) func getRevenueSummary() : async Types.RevenueSummary {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    ServiceQueueLib.summarizeRevenue(requests);
  };
};
