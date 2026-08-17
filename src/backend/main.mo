import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import Expose "mo:caffeineai-oql/Expose";
import MapEntity "mo:caffeineai-oql/MapEntity";
import ArrayEntity "mo:caffeineai-oql/ArrayEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import ServiceStatusValue "types/ServiceStatusValue";
import ServiceQueueTypes "types/service-queue";
import ServiceQueueApi "mixins/service-queue-api";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  type DayHours = {
    days : Text;
    hours : Text;
  };

  type BusinessInfo = {
    name : Text;
    tagline : Text;
    phone : Text;
    email : Text;
    address : Text;
    openingHours : [DayHours];
  };

  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    price : Text;
    duration : Text;
  };

  type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    bio : Text;
    photo : Text;
  };

  type Testimonial = {
    id : Nat;
    author : Text;
    quote : Text;
  };

  type GalleryImage = {
    id : Nat;
    url : Text;
    caption : Text;
  };

  type BookingRequest = {
    id : Nat;
    name : Text;
    contact : Text;
    service : Text;
    preferredTime : Text;
    message : Text;
    createdAt : Time.Time;
    handled : Bool;
  };

  let businessInfo : BusinessInfo;
  let services : [Service];
  let team : [TeamMember];
  let testimonials : [Testimonial];
  let gallery : [GalleryImage];
  let bookingRequests : Map.Map<Nat, BookingRequest>;
  var nextRequestId : Nat;
  let serviceRequests : Map.Map<Nat, ServiceQueueTypes.ServiceRequest>;
  let serviceQueueState : { var next : Nat };

  include ServiceQueueApi(serviceRequests, serviceQueueState, accessControlState);

  include Expose({
    entities = [
      // Service requests: private admin data — controller only.
      serviceRequests
        .toEntity("serviceRequest", "ServiceRequest", "id")
        .sample({
          id = 0;
          name = "";
          contact = "";
          deviceType = "";
          service = "";
          complaint = "";
          handoverTime = "";
          createdAt = 0 : Int;
          price = 0;
          status = #Diterima;
        })
        .controllerOnly()
        .build(),
      // Booking requests: private admin data — controller only.
      bookingRequests
        .toEntity("bookingRequest", "BookingRequest", "id")
        .sample({
          id = 0;
          name = "";
          contact = "";
          service = "";
          preferredTime = "";
          message = "";
          createdAt = 0;
          handled = false;
        })
        .controllerOnly()
        .build(),
      // Public catalogue data — world-readable.
      services
        .toEntity<Service>("service", "Service", "id")
        .sample({ id = 0; name = ""; description = ""; price = ""; duration = "" })
        .public_()
        .build(),
      team
        .toEntity<TeamMember>("teamMember", "TeamMember", "id")
        .sample({ id = 0; name = ""; role = ""; bio = ""; photo = "" })
        .public_()
        .build(),
      testimonials
        .toEntity<Testimonial>("testimonial", "Testimonial", "id")
        .sample({ id = 0; author = ""; quote = "" })
        .public_()
        .build(),
      gallery
        .toEntity<GalleryImage>("galleryImage", "GalleryImage", "id")
        .sample({ id = 0; url = ""; caption = "" })
        .public_()
        .build(),
      // Business info: a single public record, exposed as a one-row entity.
      OQL.Entity.manual<BusinessInfo>("businessInfo", func () = [businessInfo].values(), "BusinessInfo", "name")
        .payload("name", func b = b.name)
        .payload("tagline", func b = b.tagline)
        .payload("phone", func b = b.phone)
        .payload("email", func b = b.email)
        .payload("address", func b = b.address)
        .payload("openingHours", func b = b.openingHours.values().map(func h = h.days # ": " # h.hours).join("; "))
        .public_()
        .build(),
    ];
  });

  public query func getBusinessInfo() : async BusinessInfo {
    businessInfo;
  };

  public query func getServices() : async [Service] {
    services;
  };

  public query func getTeam() : async [TeamMember] {
    team;
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonials;
  };

  public query func getGallery() : async [GalleryImage] {
    gallery;
  };

  public shared func submitBookingRequest(name : Text, contact : Text, service : Text, preferredTime : Text, message : Text) : async Nat {
    if (name == "" or contact == "") {
      Runtime.trap("Name and contact details are required");
    };

    let request : BookingRequest = {
      id = nextRequestId;
      name;
      contact;
      service;
      preferredTime;
      message;
      createdAt = Time.now();
      handled = false;
    };

    bookingRequests.add(request.id, request);
    nextRequestId += 1;
    request.id;
  };

  public shared query ({ caller }) func listBookingRequests() : async [BookingRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    bookingRequests.values().toArray();
  };

  public shared ({ caller }) func setBookingRequestHandled(id : Nat, handled : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    switch (bookingRequests.get(id)) {
      case (null) { Runtime.trap("Booking request not found") };
      case (?request) {
        bookingRequests.add(id, { request with handled = handled });
      };
    };
  };

  public shared ({ caller }) func deleteBookingRequest(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    bookingRequests.remove(id);
  };
};
