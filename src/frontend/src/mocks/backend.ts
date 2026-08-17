import {
  ServiceStatus,
  UserRole,
} from "../backend";
import type {
  backendInterface,
  BookingRequest,
  BusinessInfo,
  GalleryImage,
  RevenueSummary,
  Service,
  ServiceRequest,
  ServiceRequestTracking,
  StatusSummary,
  TeamMember,
  Testimonial,
} from "../backend";

const services: Service[] = [
  {
    id: 1n,
    name: "Perbaikan Laptop",
    description: "Diagnosis dan perbaikan laptop, termasuk penggantian komponen.",
    duration: "2-3 hari",
    price: "Rp 350.000",
  },
  {
    id: 2n,
    name: "Perbaikan Smartphone",
    description: "Perbaikan layar, baterai, dan komponen smartphone.",
    duration: "1-2 hari",
    price: "Rp 250.000",
  },
];

const businessInfo: BusinessInfo = {
  name: "TechFix",
  tagline: "Solusi perbaikan perangkat teknologi Anda",
  email: "halo@techfix.id",
  phone: "0812-3456-7890",
  address: "Jl. Teknologi No. 12, Jakarta",
  openingHours: [
    { days: "Senin - Jumat", hours: "09.00 - 18.00" },
    { days: "Sabtu", hours: "09.00 - 15.00" },
  ],
};

const team: TeamMember[] = [
  {
    id: 1n,
    name: "Andi Pratama",
    role: "Teknisi Utama",
    bio: "Spesialis perbaikan laptop dan motherboard.",
    photo: "",
  },
  {
    id: 2n,
    name: "Budi Santoso",
    role: "Teknisi Smartphone",
    bio: "Ahli penggantian layar dan baterai.",
    photo: "",
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1n,
    quote: "Perbaikan cepat dan hasil memuaskan. Sangat direkomendasikan!",
    author: "Rina W.",
  },
  {
    id: 2n,
    quote: "Teknisi profesional, harga transparan. Terima kasih TechFix!",
    author: "Dedi K.",
  },
];

const gallery: GalleryImage[] = [
  { id: 1n, url: "", caption: "Ruang kerja teknisi" },
  { id: 2n, url: "", caption: "Peralatan diagnosis" },
];

const tracking: ServiceRequestTracking = {
  id: 12345n,
  service: "Perbaikan Laptop",
  status: ServiceStatus.Dikerjakan,
  deviceType: "Laptop ASUS VivoBook",
  handoverTime: "Jumat, 20 Agustus 2026, 14.00 WIB",
};

const revenueSummary: RevenueSummary = {
  completedCount: 12n,
  totalRevenue: 4250000n,
  counts: {
    diterima: 5n,
    dikerjakan: 8n,
    selesai: 7n,
    diambil: 5n,
  },
};

const statusSummary: StatusSummary = {
  diterima: 5n,
  dikerjakan: 8n,
  selesai: 7n,
  diambil: 5n,
};

const serviceRequests: ServiceRequest[] = [
  {
    id: 12345n,
    service: "Perbaikan Laptop",
    status: ServiceStatus.Dikerjakan,
    contact: "0812-3456-7890",
    name: "Rina W.",
    createdAt: 1720000000000n,
    complaint: "Layar berkedip",
    deviceType: "Laptop ASUS VivoBook",
    handoverTime: "Jumat, 20 Agustus 2026, 14.00 WIB",
    price: 350000n,
  },
];

const bookingRequests: BookingRequest[] = [
  {
    id: 1n,
    service: "Perbaikan Laptop",
    contact: "0812-1111-2222",
    handled: false,
    name: "Siti A.",
    createdAt: 1720000000000n,
    message: "Mau konsultasi dulu",
    preferredTime: "Senin, 09.00",
  },
];

export const mockBackend: backendInterface = {
  __accessControlState: async () => null,
  __bookingRequests: async () => [],
  __businessInfo: async () => businessInfo,
  __gallery: async () => gallery,
  __nextRequestId: async () => 0n,
  __serviceQueueState: async () => null,
  __serviceRequests: async () => [],
  __services: async () => services,
  __team: async () => team,
  __testimonials: async () => testimonials,
  _initialize_access_control: async () => {},
  _internet_identity_sign_in_finish: async () => ({ __kind__: "ok", ok: null }),
  _internet_identity_sign_in_start: async () => new Uint8Array(),
  assignCallerUserRole: async (_user: unknown, _role: UserRole) => {},
  deleteBookingRequest: async (_id: bigint) => {},
  deleteServiceRequest: async (_id: bigint) => {},
  execute: async (_qJson: string) => ({ hasMore: false, rows: [] }),
  getBusinessInfo: async () => businessInfo,
  getCallerUserRole: async () => UserRole.guest,
  getGallery: async () => gallery,
  getRevenueSummary: async () => revenueSummary,
  getServiceRequestStatusSummary: async () => statusSummary,
  getServiceRequestTracking: async (id: bigint) =>
    id === 12345n ? tracking : null,
  getServices: async () => services,
  getTeam: async () => team,
  getTestimonials: async () => testimonials,
  isCallerAdmin: async () => false,
  listBookingRequests: async () => bookingRequests,
  listServiceRequests: async () => serviceRequests,
  schema: async () => "",
  setBookingRequestHandled: async (_id: bigint, _handled: boolean) => {},
  setServiceRequestStatus: async (_id: bigint, _status: ServiceStatus) => true,
  submitBookingRequest: async (
    _name: string,
    _contact: string,
    _service: string,
    _preferredTime: string,
    _message: string,
  ) => 1n,
  submitServiceRequest: async (
    _name: string,
    _contact: string,
    _deviceType: string,
    _service: string,
    _complaint: string,
    _handoverTime: string,
    _price: bigint,
  ) => 12345n,
};
