import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingRequest,
  BusinessInfo,
  GalleryImage,
  RevenueSummary,
  Service,
  ServiceRequest,
  ServiceRequestTracking,
  ServiceStatus,
  StatusSummary,
  TeamMember,
  Testimonial,
} from "../backend";
import { createActor } from "../backend";

export function useGetBusinessInfo() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BusinessInfo>({
    queryKey: ["businessInfo"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getBusinessInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetServices() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTeam() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeam();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTestimonials() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGallery() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<GalleryImage[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGallery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitBookingRequest() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (params: {
      name: string;
      contact: string;
      service: string;
      preferredTime: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitBookingRequest(
        params.name,
        params.contact,
        params.service,
        params.preferredTime,
        params.message,
      );
    },
  });
}

export function useListBookingRequests(enabled: boolean) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BookingRequest[]>({
    queryKey: ["bookingRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBookingRequests();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useSetBookingRequestHandled() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; handled: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setBookingRequestHandled(params.id, params.handled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
    },
  });
}

export function useDeleteBookingRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBookingRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
    },
  });
}

export function useSubmitServiceRequest() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (params: {
      name: string;
      contact: string;
      deviceType: string;
      service: string;
      complaint: string;
      handoverTime: string;
      price: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitServiceRequest(
        params.name,
        params.contact,
        params.deviceType,
        params.service,
        params.complaint,
        params.handoverTime,
        params.price,
      );
    },
  });
}

export function useListServiceRequests(enabled: boolean) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ServiceRequest[]>({
    queryKey: ["serviceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listServiceRequests();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useSetServiceRequestStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; status: ServiceStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setServiceRequestStatus(params.id, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
    },
  });
}

export function useDeleteServiceRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteServiceRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
    },
  });
}

export function useGetServiceRequestStatusSummary(enabled: boolean) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<StatusSummary>({
    queryKey: ["serviceRequestStatusSummary"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getServiceRequestStatusSummary();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetServiceRequestTracking(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ServiceRequestTracking | null>({
    queryKey: ["serviceRequestTracking", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getServiceRequestTracking(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetRevenueSummary(enabled: boolean) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<RevenueSummary>({
    queryKey: ["revenueSummary"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getRevenueSummary();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}
