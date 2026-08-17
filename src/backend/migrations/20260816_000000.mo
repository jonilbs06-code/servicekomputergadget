import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

// Adds the service-queue domain stable state: a map of service requests and a
// counter for the next request id. The OldActor matches the NewActor of the
// preceding Init migration; the new fields are seeded empty.
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

  type ServiceRequest = {
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

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    businessInfo : BusinessInfo;
    services : [Service];
    team : [TeamMember];
    testimonials : [Testimonial];
    gallery : [GalleryImage];
    bookingRequests : Map.Map<Nat, BookingRequest>;
    var nextRequestId : Nat;
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
    serviceRequests : Map.Map<Nat, ServiceRequest>;
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
      serviceRequests = Map.empty();
      serviceQueueState = { var next = 0 };
    };
  };
};
