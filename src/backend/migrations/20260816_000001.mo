import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

// Adds a `price` field to ServiceRequest so revenue can be computed from
// completed/handover repairs. The OldActor matches the NewActor of the
// preceding 20260816_000000 migration; the serviceRequests map is empty at
// this point, so no per-record transformation is required — only the type
// gains the new field.
module {
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
    createdAt : Int;
    handled : Bool;
  };

  type ServiceStatus = {
    #Diterima;
    #Dikerjakan;
    #Selesai;
    #Diambil;
  };

  type OldServiceRequest = {
    id : Nat;
    name : Text;
    contact : Text;
    deviceType : Text;
    service : Text;
    complaint : Text;
    handoverTime : Text;
    createdAt : Int;
    status : ServiceStatus;
  };

  type NewServiceRequest = {
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

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    businessInfo : BusinessInfo;
    services : [Service];
    team : [TeamMember];
    testimonials : [Testimonial];
    gallery : [GalleryImage];
    bookingRequests : Map.Map<Nat, BookingRequest>;
    var nextRequestId : Nat;
    serviceRequests : Map.Map<Nat, OldServiceRequest>;
    serviceQueueState : { var next : Nat };
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    businessInfo : BusinessInfo;
    services : [Service];
    team : [TeamMember];
    testimonials : [Testimonial];
    gallery : [GalleryImage];
    bookingRequests : Map.Map<Nat, BookingRequest>;
    var nextRequestId : Nat;
    serviceRequests : Map.Map<Nat, NewServiceRequest>;
    serviceQueueState : { var next : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      businessInfo = old.businessInfo;
      services = old.services;
      team = old.team;
      testimonials = old.testimonials;
      gallery = old.gallery;
      bookingRequests = old.bookingRequests;
      var nextRequestId = old.nextRequestId;
      serviceRequests = old.serviceRequests.map(
        func(_, request) {
          {
            id = request.id;
            name = request.name;
            contact = request.contact;
            deviceType = request.deviceType;
            service = request.service;
            complaint = request.complaint;
            handoverTime = request.handoverTime;
            createdAt = request.createdAt;
            status = request.status;
            price = 0;
          };
        }
      );
      serviceQueueState = old.serviceQueueState;
    };
  };
};
