/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  // Users,
  Tag,
  Calendar,
  // Clock,
  Camera,
  ArrowRight,
  X,
  ArrowLeft,
  Search,
  PlusCircle,
  Trash2,
  GripVertical,
  Check,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useGetTemplateByIdQuery } from "@/RTK/TemplatesQuery/templatesQuery";
import { useGetCategoriesQuery } from "@/RTK/CategoriesQuery/categoriesQuery";
import { useGetCurrenciesQuery } from "@/RTK/CurrenciesQuery/currenciesQuery";
import { useCreateEventMutation } from "@/RTK/EventsQuery/eventsQuery";
import { uploadImageToS3, deleteS3Object } from "@/utils/s3Upload";
import {
  getAllTemplatesInCategory,
  getCategories,
  getTemplateFile,
  getTemplatePrice,
  type TemplateSummary,
} from "@/service/templateLoader";
import TemplatePreview from "@/components/TemplatePreview";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";

type EventSession = {
  id: string;
  name: string;
  date: string;
  timezone: string;
  start_time: string;
  end_time: string;
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    host: "",
    location: "",
    city: "",
    country: "",
    timezone: "",
    latitude: 0,
    longitude: 0,
    capacity: "",
    category: undefined as string | undefined, // Will store category ID
    startDate: "",
    startTime: "",
    endDate: "",
    isAllDay: false,
    isFreeEvent:false,
    isVirtual :false,
    // hasEndDate: false,
    isMultiDayEvent: false,
    createForm: false,
    allowComments: false,
    multimediaSupport: false,
    hasTickets: false,
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [selectedLocalTemplate, setSelectedLocalTemplate] =
    useState<TemplateSummary | null>(null);
  const [LoadedTemplate, setLoadedTemplate] =
    useState<React.ComponentType<any> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [templateFields, setTemplateFields] = useState<Record<string, string>>(
    {},
  );
  const [templateDefaults, setTemplateDefaults] = useState<
    Record<string, string>
  >({});
  const [attendeeBlocks, setAttendeeBlocks] = useState<any[]>([]);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragEnabledFor, setDragEnabledFor] = useState<string | null>(null);
  const [draggingOption, setDraggingOption] = useState<{
    blockId: string;
    index: number;
  } | null>(null);
  const [dragEnabledForOption, setDragEnabledForOption] = useState<{
    blockId: string;
    index: number;
  } | null>(null);
  const [sessions, setSessions] = useState<EventSession[]>([
    {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: "",
      date: "",
      timezone: "Africa/Lagos",
      start_time: "",
      end_time: "",
    },
  ]);
  const [activeTimezonePicker, setActiveTimezonePicker] = useState<string | null>(null);
  const [showSessionsValidation, setShowSessionsValidation] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const [coordinatesError, setCoordinatesError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageKey, setUploadedImageKey] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [_userCountry, setUserCountry] = useState<string | null>(null);
  const [ipLocationData, setIpLocationData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createEventMutation] = useCreateEventMutation();

  // console.log(userCountry, 'country')

  const appliedTemplateProps = useMemo(() => {
    const entries = Object.entries(templateFields).filter(([, v]) =>
      typeof v === "string" ? v.trim() !== "" : v != null,
    );
    
    // Map image key to image_url for template compatibility
    const mappedEntries = entries.map(([key, value]) => {
      if (key === "image" || key === "") {
        return ["image_url", value];
      }
      return [key, value];
    });
    
    // Filter out the original image key to avoid conflicts
    const filteredEntries = mappedEntries.filter(([key]) => key !== "image" && key !== "");
    
    return Object.fromEntries(filteredEntries);
  }, [templateFields]);

  const timezones = useMemo(() => {
    if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
      try {
        return Intl.supportedValuesOf("timeZone");
      } catch {
        return ["Africa/Lagos"];
      }
    }
    return ["Africa/Lagos"];
  }, []);

  const formatTimezoneLabel = (timezone: string) => {
    const parts = timezone.split("/");
    const city = (parts[parts.length - 1] || timezone).replace(/_/g, " ");
    const region = (parts[0] || "").replace(/_/g, " ");

    let offsetLabel = "GMT";
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      });
      const zonePart = formatter
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value;
      if (zonePart) {
        offsetLabel = zonePart.replace("GMT", "GMT");
      }
    } catch {
      offsetLabel = "GMT";
    }

    return `${city}, ${region} (${offsetLabel})`;
  };

  const timezoneOptions = useMemo(
    () =>
      timezones.map((timezone) => ({
        value: timezone,
        label: formatTimezoneLabel(timezone),
      })),
    [timezones],
  );

  const areSessionsValid = useMemo(
    () =>
      sessions.every((session) =>
        [
          session.name,
          session.date,
          session.timezone,
          session.start_time,
          session.end_time,
        ].every((value) => value.trim() !== ""),
      ),
    [sessions],
  );

  const countryOptions = useMemo(() => {
    const fallbackCountries = [
      "Nigeria",
      "Ghana",
      "Kenya",
      "South Africa",
      "United States",
      "United Kingdom",
      "Canada",
      "Germany",
      "France",
      "India",
      "Australia",
      "Brazil",
      "China",
      "Egypt",
      "Spain",
      "Italy",
      "Japan",
      "Mexico",
      "Netherlands",
      "Pakistan",
      "Qatar",
      "Rwanda",
      "Saudi Arabia",
      "Singapore",
      "Tanzania",
      "Uganda",
    ];

    try {
      if (typeof Intl !== "undefined" && "DisplayNames" in Intl) {
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const regionCodes: string[] = [];

        for (const first of letters) {
          for (const second of letters) {
            regionCodes.push(`${first}${second}`);
          }
        }

        return Array.from(
          new Set(
            regionCodes
              .map((code) => regionNames.of(code))
              .filter((country): country is string => typeof country === 'string' && !/^[A-Z]{2}$/.test(country)),
          ),
        )
          .filter((country) => country.toLowerCase() !== "world")
          .sort((a, b) => a.localeCompare(b));
      }
    } catch {
      return [...fallbackCountries].sort((a, b) => a.localeCompare(b));
    }

    return [...fallbackCountries].sort((a, b) => a.localeCompare(b));
  }, []);

  // Fetch user country from IP
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        // Use ipinfo.io (CORS-friendly and reliable)
        const res = await fetch('https://ipinfo.io/json');
        const data = await res.json();
        if (data?.country) {
          // Convert country code to full country name
          let fullCountryName = data.country;
          try {
            const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
            fullCountryName = regionNames.of(data.country) || data.country;
          } catch {
            // Fallback to country code if conversion fails
          }
          
          setUserCountry(fullCountryName);
          setIpLocationData({
            country_name: fullCountryName,
            city: data.city,
            timezone: data.timezone,
            currency: 'USD', // ipinfo doesn't provide currency, default to USD
          });

          // Auto-populate city and country if empty
          setFormData((prev) => ({
            ...prev,
            city: prev.city || data.city || '',
            country: prev.country || fullCountryName || '',
            timezone: prev.timezone || data.timezone || '',
          }));

          // Set default timezone for new sessions
          if (data.timezone) {
            setSessions((prev) =>
              prev.map((s) => ({
                ...s,
                timezone: s.timezone || data.timezone,
              })),
            );
          }
        }
      } catch {
        // silently ignore
      }
    };
    fetchUserCountry();
  }, []);

  // Fetch selected template details
  const { data: templateData, refetch: refetchTemplate } =
    useGetTemplateByIdQuery(selectedTemplateId || '', {
      skip: !selectedTemplateId,
      refetchOnMountOrArgChange: true,
    });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: currenciesData } = useGetCurrenciesQuery();

  // Set default currency from IP location once currenciesData is available
  useEffect(() => {
    if (!currenciesData?.data || !ipLocationData?.currency) return;

    const match = currenciesData.data.find(
      (c: any) => c.currency === ipLocationData.currency,
    );
    const target = match || currenciesData.data.find((c: any) => c.currency === 'USD');
    
    if (target) {
      setCurrency(target.id);
      setTickets((prev) =>
        prev.map((t) => ({
          ...t,
          currency_id: target.id,
        })),
      );
    }
  }, [currenciesData, ipLocationData]);

  // Pre-populate form fields when template is selected
  useEffect(() => {
    if (templateData?.data) {
      const template = templateData.data;
      // Find the category ID that matches the template's category name
      const matchingCategory = categoriesData?.data?.find(
        (cat) => cat.category.toLowerCase() === template.category?.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        title: template.title || prev.title,
        description: template.description || prev.description,
        host: template.host || prev.host,
        category: matchingCategory?.id || prev.category,
      }));
      // Initialize dynamic template fields for props (merge with any existing defaults)
      if (Array.isArray(template.props)) {
        const init: Record<string, string> = {};
        template.props
          .filter(
            (p) => (p?.prop_name || "").toLowerCase() !== "kidsbirthdaycard",
          )
          .forEach((p) => {
            init[p.prop_name] = init[p.prop_name] ?? "";
          });
        setTemplateFields((prev) => {
          // Prefer non-empty existing values (e.g., from DEFAULT_PROPS) over empty init strings
          const merged: Record<string, string> = { ...init };
          for (const [k, v] of Object.entries(prev || {})) {
            const isEmpty = typeof v === "string" ? v.trim() === "" : v == null;
            if (!isEmpty) merged[k] = v as string;
          }

          // Also prefer any defaults we have if current merged key is empty
          for (const [k, v] of Object.entries(templateDefaults)) {
            const curr = merged[k];
            const isEmpty =
              typeof curr === "string" ? curr.trim() === "" : curr == null;
            if (isEmpty && v?.trim()) merged[k] = v;
          }
          return merged;
        });
      } else {
        setTemplateFields((prev) => prev);
      }
    }
  }, [templateData, categoriesData]);

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const fetchCoordinates = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Unable to fetch coordinates");
    }

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;

    if (!data.length) {
      throw new Error("Location not found");
    }

    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    };
  };

  const triggerCoordinatesLookup = () => {
    const address = [formData.location, formData.city, formData.country]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(", ");

    if (!address) {
      setCoordinatesError(null);
      setIsFetchingCoordinates(false);
      setCoordinates({ latitude: 0, longitude: 0 });
      return undefined;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setIsFetchingCoordinates(true);
        setCoordinatesError(null);
        const nextCoordinates = await fetchCoordinates(address);
        setCoordinates(nextCoordinates);
      } catch (error) {
        setCoordinatesError(
          error instanceof Error ? error.message : "Unable to fetch coordinates",
        );
        setCoordinates({ latitude: 0, longitude: 0 });
      } finally {
        setIsFetchingCoordinates(false);
      }
    }, 500);

    return timeout;
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const { url, key } = await uploadImageToS3(file);
      setUploadedImage(url);
      setUploadedImageKey(key);
      localStorage.setItem('createEventImage', url);
      localStorage.setItem('createEventImageKey', key);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      setUploadError(errorMessage);
      console.error('Image upload error:', error);
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

  const clearUploadedImage = useCallback(async () => {
    try {
      if (uploadedImageKey) {
        await deleteS3Object(uploadedImageKey);
      }
    } catch (err) {
      console.error('Failed to delete image from S3:', err);
    } finally {
      setUploadedImage(null);
      setUploadedImageKey(null);
      setUploadError(null);
      localStorage.removeItem('createEventImage');
      localStorage.removeItem('createEventImageKey');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [uploadedImageKey]);

  const buildIsoDateTime = (date: string, time?: string) => {
    if (!date) return undefined;
    const safeTime = time && time.trim() ? time : "00:00";
    return new Date(`${date}T${safeTime}:00`).toISOString();
  };

  const buildEventPayload = useCallback(() => {
    const normalizedMediaUrl =
      typeof uploadedImage === "string" && uploadedImage.trim() !== ""
        ? uploadedImage.trim()
        : undefined;

    return {
      title: formData.title,
      description: formData.description,
      host: formData.host,
      category_id: formData.category || undefined,
      location: formData.location,
      city: formData.city,
      country: formData.country,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      media_url: normalizedMediaUrl || 'https://www.google.com',
      template_id: selectedTemplateId || undefined,
      start_date: buildIsoDateTime(formData.startDate, formData.startTime),
      end_date: buildIsoDateTime(formData.endDate || formData.startDate, formData.startTime),
      is_all_day_event: formData.isAllDay,
      is_ticketing_enabled: formData.hasTickets,
      is_free_event: formData.isFreeEvent,
      is_multimedia_enabled: formData.multimediaSupport,
      is_engagement_enabled: formData.allowComments,
      is_multi_day_event: formData.isMultiDayEvent,
      is_form_enabled: formData.createForm,
      is_virtual: formData.isVirtual,
      sessions: formData.isMultiDayEvent
        ? sessions.map((s) => ({
            name: s.name,
            date: buildIsoDateTime(s.date),
            timezone: s.timezone,
            start_time: s.start_time,
            end_time: s.end_time,
          }))
        : [],
      tickets: formData.hasTickets
        ? tickets.map((t) => ({
            currency_id: t.currency_id || currency,
            name: t.name,
            description: t.description,
            price: t.is_free ? 0 : Number(t.price || 0),
            quantity: Number(t.quantity || 0),
            is_free: t.is_free,
            is_predefined: t.is_predefined,
          }))
        : [],
      template_props_responses: selectedTemplateId && templateData?.data?.props
        ? templateData.data.props
            .filter((prop) => {
              const value = templateFields[prop.prop_name];
              return typeof value === "string" && value.trim() !== "";
            })
            .map((prop) => ({
              template_prop_id: prop.id,
              prop_response: templateFields[prop.prop_name],
            }))
        : [],
      form: formData.createForm
        ? {
            form_fields: attendeeBlocks.map((b) => ({
              field_label: b.question || b.label || "",
              field_type:
                b.type === "multi"
                  ? "checkbox"
                  : b.type === "input"
                    ? "text"
                    : b.type,
              is_required: Boolean(b.required),
              options: b.options || [],
            })),
          }
        : undefined,
    };
  }, [formData, uploadedImage, coordinates, selectedTemplateId, sessions, tickets, currency, templateData, templateFields, buildIsoDateTime, attendeeBlocks]);

  const handleCreateEvent = useCallback(async () => {
    const payload = buildEventPayload();
    setIsSubmitting(true);
    try {
      const result = await createEventMutation(payload).unwrap();

      toast.success(result?.message || "Event created successfully");
      navigate("/dashboard");
    } catch (error: any) {
      const validationMessage = error?.data?.error?.details?.[0]?.message;
      toast.error(validationMessage || error?.data?.message || error?.data?.error || error?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  }, [createEventMutation, navigate, buildEventPayload]);

  useEffect(() => {
    const stored = localStorage.getItem('createEventImage');
    const storedKey = localStorage.getItem('createEventImageKey');
    if (stored) setUploadedImage(stored);
    if (storedKey) setUploadedImageKey(storedKey);
  }, []);

  useEffect(() => {
    const handler = () => {
      localStorage.removeItem('createEventImage');
      localStorage.removeItem('createEventImageKey');
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      handler();
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  const handleToggle = useCallback((field: string) => {
    setFormData((prev) => {
      const newValue = !prev[field as keyof typeof prev];
      
      // When toggling "This Event is Free?", update all tickets accordingly
      if (field === 'isFreeEvent') {
        setTickets((prevTickets) =>
          prevTickets.map((t) => ({ ...t, is_free: newValue, price: newValue ? '0' : t.price || '' }))
        );
      }
      
      // Prevent both all-day and multi-day from being ON at the same time
      if (field === 'isAllDay' && newValue && prev.isMultiDayEvent) {
        return {
          ...prev,
          isAllDay: true,
          isMultiDayEvent: false,
        };
      }
      
      if (field === 'isMultiDayEvent' && newValue && prev.isAllDay) {
        return {
          ...prev,
          isMultiDayEvent: true,
          isAllDay: false,
        };
      }
      
      return {
        ...prev,
        [field]: newValue,
      };
    });
  }, []);

  const handleTemplateSelect = useCallback((template: TemplateSummary) => {
    const id = template.dbId;
    console.log("Selected template dbId:", id);
    if (id) {
      if (id === selectedTemplateId) {
        // Force re-fetch when the same template is selected again
        refetchTemplate();
      } else {
        setSelectedTemplateId(id);
      }
    } else {
      setSelectedTemplateId(null);
    }
    // Reset dynamic fields so defaults from the new template can apply
    setTemplateFields({});
    setSelectedLocalTemplate(template);
    setIsTemplateModalOpen(false);
  }, [selectedTemplateId, refetchTemplate]);

  const handleClearTemplate = useCallback(() => {
    setSelectedTemplateId(null);
    setSelectedLocalTemplate(null);
    setLoadedTemplate(null);
    setTemplateFields({});
    setTemplateDefaults({});
    setLoadError(null);
    // Optionally clear pre-populated fields
    setFormData((prev) => ({
      ...prev,
      title: "",
      description: "",
      host: "",
      category: undefined, // Will store category ID
      city: "",
      country: "",
    }));
  }, []);

  // Wizard step flow handlers
  const handleContinue = useCallback(() => {
    if (step === 1) {
      if (formData.isMultiDayEvent) {
        setStep(2);
        return;
      }
      if (formData.createForm) {
        setStep(3);
        return;
      }
      if (formData.hasTickets) {
        setStep(4);
        return;
      }
      void handleCreateEvent();
      return;
    }
    if (step === 2) {
      if (!areSessionsValid) {
        setShowSessionsValidation(true);
        return;
      }
      setShowSessionsValidation(false);
      if (formData.createForm) {
        setStep(3);
        return;
      }
      if (formData.hasTickets) {
        setStep(4);
        return;
      }
      void handleCreateEvent();
      return;
    }
    if (step === 3) {
      if (formData.hasTickets) {
        setStep(4);
        return;
      }
      void handleCreateEvent();
      return;
    }
    if (step === 4) {
      void handleCreateEvent();
      return;
    }
  }, [step, formData, areSessionsValid, handleCreateEvent]);

  const handleBack = useCallback(() => {
    if (step === 2) {
      setStep(1);
      return;
    }
    if (step === 3) {
      if (formData.isMultiDayEvent) {
        setStep(2);
        return;
      }
      setStep(1);
      return;
    }
    if (step === 4) {
      if (formData.createForm) {
        setStep(3);
        return;
      }
      if (formData.isMultiDayEvent) {
        setStep(2);
        return;
      }
      setStep(1);
      return;
    }
    navigate(-1);
  }, [step, formData, navigate]);

  const getPrimaryActionLabel = () => {
    if (step === 1) {
      return formData.isMultiDayEvent || formData.createForm || formData.hasTickets
        ? "Continue"
        : "Create Event";
    }
    if (step === 2) {
      return formData.createForm || formData.hasTickets ? "Continue" : "Create Event";
    }
    if (step === 3) {
      return formData.hasTickets ? "Continue" : "Create Event";
    }
    return "Create Event";
  };

  // Attendee form builder helpers
  const addBlock = useCallback((type: "input" | "textarea" | "radio" | "multi") => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setAttendeeBlocks((prev) => [
      ...prev,
      {
        id,
        type,
        question: "",
        options: type === "radio" ? ["", ""] : type === "multi" ? [] : [],
      },
    ]);
  }, []);
  const removeBlock = useCallback((id: string) =>
    setAttendeeBlocks((prev) => prev.filter((b) => b.id !== id)),
  []);

  const updateBlock = useCallback((id: string, patch: any) =>
    setAttendeeBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    ),
  []);

  const addOption = useCallback((id: string) =>
    setAttendeeBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, options: [...(b.options || []), ""] } : b,
      ),
    ),
  []);

  const updateOption = useCallback((id: string, index: number, value: string) =>
    setAttendeeBlocks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              options: (b.options || []).map((o: string, i: number) =>
                i === index ? value : o,
              ),
            }
          : b,
      ),
    ),
  []);

  const removeOption = useCallback((id: string, index: number) =>
    setAttendeeBlocks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              options: (b.options || []).filter(
                (_: string, i: number) => i !== index,
              ),
            }
          : b,
      ),
    ),
  []);

  const moveOption = useCallback((blockId: string, fromIndex: number, toIndex: number) => {
    setAttendeeBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const opts: string[] = Array.isArray(b.options) ? [...b.options] : [];
        if (
          fromIndex < 0 ||
          fromIndex >= opts.length ||
          toIndex < 0 ||
          toIndex >= opts.length ||
          fromIndex === toIndex
        )
          return b;
        const [item] = opts.splice(fromIndex, 1);
        opts.splice(toIndex, 0, item);
        return { ...b, options: opts };
      }),
    );
  }, []);

  // Reorder blocks via drag & drop
  const moveBlock = useCallback((fromId: string, toId: string) => {
    setAttendeeBlocks((prev) => {
      const fromIndex = prev.findIndex((b) => b.id === fromId);
      const toIndex = prev.findIndex((b) => b.id === toId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
        return prev;
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  }, []);

  // Tickets helpers
  const addTicket = useCallback(() => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setTickets((prev) => [
      ...prev,
      {
        id,
        currency_id: currency,
        name: "",
        description: "",
        price: "",
        quantity: "",
        is_free: false,
        is_predefined: false,
      },
    ]);
  }, [currency]);

  const updateTicket = useCallback((id: string, patch: any) =>
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    ),
  []);

  const removeTicket = useCallback((id: string) =>
    setTickets((prev) => prev.filter((t) => t.id !== id)),
  []);

  // Sessions helpers
  const addSession = useCallback(() => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setSessions((prev) => [
      ...prev,
      {
        id,
        name: "",
        date: "",
        timezone: "Africa/Lagos",
        start_time: "",
        end_time: "",
      },
    ]);
  }, []);

  const updateSession = useCallback((id: string, patch: Partial<EventSession>) =>
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, ...patch } : session,
      ),
    ),
  []);

  const removeSession = useCallback((id: string) =>
    setSessions((prev) =>
      prev.length > 1 ? prev.filter((session) => session.id !== id) : prev,
    ),
  []);

  // Dynamically load local template component for preview when selected
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (selectedLocalTemplate) {
          setIsLoadingTemplate(true);
          setLoadError(null);
          const id = String(selectedLocalTemplate.localId);
          console.log(
            "[TemplateLoader] Loading local template",
            selectedLocalTemplate.category,
            id,
          );
          const mod = await getTemplateFile(
            selectedLocalTemplate.category as any,
            id,
          );
          if (!cancelled && mod && (mod as any).default) {
            setLoadedTemplate(
              () => (mod as any).default as React.ComponentType<any>,
            );
            console.log("[TemplateLoader] Loaded local template module");

            // Prefill template fields from template's DEFAULT_PROPS if available
            const defaults = (mod as any).DEFAULT_PROPS as
              | Record<string, unknown>
              | undefined;
            if (defaults && typeof defaults === "object") {
              const normalize = (key: string, val: unknown): string => {
                const lname = (key || "").toLowerCase();
                const s =
                  typeof val === "string"
                    ? val
                    : val != null
                      ? String(val)
                      : "";
                if (!s) return "";
                if (lname.includes("date")) {
                  const d = new Date(s);
                  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
                }
                if (lname.includes("time")) {
                  const ampm = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i;
                  const m = s.match(ampm);
                  if (m) {
                    let hh = parseInt(m[1], 10);
                    const mm = m[2] ? parseInt(m[2], 10) : 0;
                    const ap = m[3].toUpperCase();
                    if (ap === "PM" && hh < 12) hh += 12;
                    if (ap === "AM" && hh === 12) hh = 0;
                    const hStr = String(hh).padStart(2, "0");
                    const mStr = String(mm).padStart(2, "0");
                    return `${hStr}:${mStr}`;
                  }
                  const d = new Date(`1970-01-01T${s}`);
                  if (!isNaN(d.getTime())) {
                    const hStr = String(d.getHours()).padStart(2, "0");
                    const mStr = String(d.getMinutes()).padStart(2, "0");
                    return `${hStr}:${mStr}`;
                  }
                }
                return s;
              };
              const init: Record<string, string> = {};
              for (const [k, v] of Object.entries(defaults)) {
                if ((k || "").toLowerCase() === "kidsbirthdaycard") continue;
                if (v === null || v === undefined) continue;
                init[k] = normalize(k, v);
              }
              if (Object.keys(init).length > 0) {
                setTemplateDefaults(init);
                // Fill only empty or missing keys with defaults; keep any user edits
                setTemplateFields((prev) => {
                  const next: Record<string, string> = { ...(prev || {}) };
                  for (const [k, v] of Object.entries(init)) {
                    const curr = (prev || {})[k];
                    const isEmpty =
                      typeof curr === "string"
                        ? curr.trim() === ""
                        : curr == null;
                    if (isEmpty) next[k] = v;
                  }
                  return next;
                });
              }
            }
          }
        } else {
          setLoadedTemplate(null);
        }
      } catch (e) {
        console.error("Failed to load local template module:", e);
        setLoadError("Failed to load template");
        if (!cancelled) setLoadedTemplate(null);
      } finally {
        if (!cancelled) setIsLoadingTemplate(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedLocalTemplate]);

  // Mobile Template Modal Component
  const TemplateModal = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("All");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [templates, setTemplates] = useState<TemplateSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const id = setTimeout(() => setDebouncedSearch(search), 300);
      return () => clearTimeout(id);
    }, [search]);

    // Load templates from local registry
    useEffect(() => {
      setIsLoading(true);
      try {
        const allCategories = getCategories();
        let allTemplates: TemplateSummary[] = [];

        if (category === "All") {
          // Load templates from all categories
          allCategories.forEach((cat) => {
            const categoryTemplates = getAllTemplatesInCategory(cat as any);
            allTemplates = [...allTemplates, ...categoryTemplates];
          });
        } else {
          // Load templates from selected category
          allTemplates = getAllTemplatesInCategory(category as any);
        }

        // Filter by search
        if (debouncedSearch) {
          allTemplates = allTemplates.filter((t) =>
            t.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
          );
        }

        setTemplates(allTemplates);
      } catch (error) {
        console.error("Error loading templates:", error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    }, [category, debouncedSearch]);

    const categories = useMemo(() => {
      return ["All", ...getCategories()];
    }, []);
    return (
      <div className="fixed inset-0 bg-white z-50 md:bg-black md:bg-opacity-50 md:flex md:items-center md:justify-center md:p-4">
        <div className="h-full w-full overflow-y-auto md:bg-white md:rounded-3xl md:p-4 md:max-w-6xl md:w-full md:max-h-[90vh] md:overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:border-none md:mb-6 sticky top-0 bg-white z-10 md:static">
            <button
              onClick={() => setIsTemplateModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1 text-center md:text-left md:flex-none">
              <h2 className="text-xl font-bold text-gray-900 md:text-2xl md:mb-1">
                Choose any template
              </h2>
              <p className="text-sm text-gray-600 md:text-base hidden md:block">
                Select any template and we would customize it to your needs
              </p>
            </div>
            <button
              onClick={() => setIsTemplateModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-4 pb-8 md:p-0" style={{ paddingBottom: "100px" }}>
            {/* Search */}
            <div className="mb-4 md:mb-6">
              <div className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="flex items-center px-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search templates"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearch("");
                  }}
                />
                <button
                  className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
                  onClick={() => {
                    /* query auto-updates via state */
                  }}
                >
                  Search
                </button>
              </div>
            </div>
            {/* Category Tabs */}
            {/* <div className="flex gap-2 mb-4 md:gap-3 md:mb-6">
            <button
              onClick={() => { setSelectedTemplateCategory('Birthday'); setCategory('Birthday') }}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors text-sm md:text-base md:px-6 md:py-2 ${
                selectedTemplateCategory === 'Birthday'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Birthday
            </button>
            <button
              onClick={() => { setSelectedTemplateCategory('Anniversary'); setCategory('Anniversary') }}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors text-sm md:text-base md:px-6 md:py-2 ${
                selectedTemplateCategory === 'Anniversary'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Anniversary
            </button>
          </div> */}
            {/* Dynamic Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    category === c
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
              {isLoading && (
                <>
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="relative aspect-[2/3] md:aspect-[3/4] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-shimmer">
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
                          {/* Price badge skeleton */}
                          <div className="absolute top-2 right-2 w-16 h-6 bg-gray-300 rounded"></div>
                          {/* Title overlay skeleton */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-300/70 to-transparent p-3">
                            <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {!isLoading && templates.length === 0 && (
                <div className="col-span-2 md:col-span-4 text-center text-gray-500 py-6">
                  No templates found.
                </div>
              )}
              {!isLoading && templates.length > 0 && (
                <>
                  {templates.map((t) => (
                    <div
                      key={t.id}
                      className="cursor-pointer group"
                      onClick={() => handleTemplateSelect(t)}
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[2/3] md:aspect-[3/4]">
                          <>
                            {t.media_url ? (
                              <img
                                src={t.media_url}
                                alt={t.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // if media fails, hide the broken image so the overlay still looks clean
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <TemplatePreview tpl={t} />
                            )}
                          </>
                          {/* Title overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white font-medium text-sm mb-1">
                              {t.title}
                            </p>
                            <p className="text-white/70 text-xs">
                              {t.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      {/* Mobile Header */}
      <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-[#eeeeee] px-2 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-3 mb-2 md:gap-2">
          <button
            onClick={() => (step > 1 ? handleBack() : navigate(-1))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          {/* <div className="flex items-center gap-2 text-sm text-gray-400 md:text-sm">
            <span className="hidden md:inline">Events</span>
            <span className="hidden md:inline">/</span>
            <span className="text-gray-600 md:text-gray-600">Create Events</span>
          </div> */}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 md:text-3xl md:mb-2">
          Create Event
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Gathering people for your event is more stylish with festifa
        </p>
      </div>

      <div className="p-4 md:flex md:gap-8 md:p-4 md:max-w-[1400px] md:mx-auto">
        {/* Image Upload Section */}
        <div className="mb-6 md:w-[550px] md:flex-shrink-0 md:mb-0">
          {LoadedTemplate && selectedLocalTemplate ? (
            // Display locally-registered template preview (e.g., kidsbirthdaycard)
            <div className="bg-white rounded-[10px] overflow-hidden h-64 md:h-[550px] relative group">
              {isLoadingTemplate ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : loadError ? (
                <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
                  Failed to load template
                </div>
              ) : (
                <div className="w-full h-full overflow-auto">
                  <LoadedTemplate key={JSON.stringify(appliedTemplateProps)} {...appliedTemplateProps} />
                </div>
              )}
              <button
                onClick={handleClearTemplate}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium text-sm mb-1">
                  {selectedLocalTemplate.title}
                </p>
                <p className="text-white/70 text-xs">
                  {selectedLocalTemplate.category}
                </p>
                {loadError && (
                  <p className="text-red-300 text-xs mt-1">{loadError}</p>
                )}
                {templateData?.data?.prices &&
                  templateData.data.prices.length > 0 && (
                    <div className="mt-2 inline-block px-2 py-1 bg-orange-500 rounded text-white text-xs font-medium">
                      {getTemplatePrice(templateData.data).displayPrice}
                    </div>
                  )}
              </div>
            </div>
          ) : selectedTemplateId && templateData?.data ? (
            // Display selected template
            <div className="bg-white rounded-[10px] overflow-hidden h-64 md:h-[550px] relative group">
              <img
                src={templateData.data.media_url}
                alt={templateData.data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/350x350/f3f4f6/9ca3af?text=Template";
                }}
              />
              {/* Cancel button */}
              <button
                onClick={handleClearTemplate}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {/* Template info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium text-sm mb-1">
                  {templateData.data.title}
                </p>
                <p className="text-white/70 text-xs">
                  {templateData.data.category}
                </p>
                {templateData.data.prices &&
                  templateData.data.prices.length > 0 && (
                    <div className="mt-2 inline-block px-2 py-1 bg-orange-500 rounded text-white text-xs font-medium">
                      {getTemplatePrice(templateData.data).displayPrice}
                    </div>
                  )}
              </div>
            </div>
          ) : uploadedImage ? (
            <div className="bg-white rounded-[10px] overflow-hidden h-64 md:h-[550px] relative group">
              <img
                src={uploadedImage}
                alt="Uploaded event image"
                className="w-full h-full object-cover"
              />
              <button
                onClick={clearUploadedImage}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium text-sm mb-1">Uploaded Image</p>
                <p className="text-white/70 text-xs">Custom event image</p>
              </div>
            </div>
          ) : (
            // Default upload section
            <div className="bg-white rounded-[10px] p-6 h-64 flex flex-col items-center justify-center border-gray-300 md:h-[350px] md:p-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:w-16 md:h-16 md:mb-6">
                <Camera className="w-6 h-6 text-gray-400 md:w-8 md:h-8" />
              </div>
              <p className="text-gray-600 mb-6 text-center text-base md:text-lg md:mb-8">
                Add image or use template
              </p>

              <div className="space-y-3 w-full max-w-[240px] md:max-w-[280px] md:space-y-4">
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors text-sm md:text-base md:px-6"
                >
                  Choose from Templates
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm md:text-base md:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingImage ? 'Uploading...' : 'Upload from device'}
                </button>
                {uploadError && (
                  <p className="text-sm text-red-500 text-center">{uploadError}</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Form / Steps Section */}
        <div className="flex-1">
          <div className="rounded-2xl p-6 md:p-8" style={{ paddingTop: "0px" }}>
            {step === 1 && (
              <div className="space-y-3 md:space-y-3 custom-box-main">
                {/* Event Title */}
                <div>
                  <Input
                    type="text"
                    placeholder="Event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                  />
                </div>

                {/* Event Description */}
                <div>
                  <textarea
                    placeholder="Event Description"
                    value={formData.description}
                    rows={3}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-base placeholder-gray-400 md:rows-4 md:py-4"
                  ></textarea>
                </div>

                {/* Host */}
                <div>
                  <Input
                    type="text"
                    placeholder="Host"
                    value={formData.host}
                    onChange={(e) => handleInputChange("host", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                  />
                </div>

                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Street Address"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    onBlur={() => {
                      const timeout = triggerCoordinatesLookup();
                      if (timeout) {
                        window.setTimeout(() => window.clearTimeout(timeout), 600);
                      }
                    }}
                    className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                  />
                </div>
                {(isFetchingCoordinates || coordinatesError || (coordinates.latitude !== 0 && coordinates.longitude !== 0)) && (
                  <div className="space-y-1">
                    {isFetchingCoordinates && (
                      <p className="text-sm text-gray-500">Fetching coordinates...</p>
                    )}
                    {coordinatesError && (
                      <p className="text-sm text-red-500">{coordinatesError}</p>
                    )}
                    {!isFetchingCoordinates &&
                      !coordinatesError &&
                      coordinates.latitude !== 0 &&
                      coordinates.longitude !== 0 && (
                        <p className="text-sm text-gray-500">
                          Latitude: {coordinates.latitude.toFixed(4)}, Longitude: {coordinates.longitude.toFixed(4)}
                        </p>
                      )}
                  </div>
                )}

                {/* City */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    onBlur={() => {
                      const timeout = triggerCoordinatesLookup();
                      if (timeout) {
                        window.setTimeout(() => window.clearTimeout(timeout), 600);
                      }
                    }}
                    className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                  />
                </div>

                {/* Country */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) => {
                      handleInputChange("country", value);
                      window.setTimeout(() => {
                        triggerCoordinatesLookup();
                      }, 0);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-base md:h-14 custom-button-dropdown">
                      <SelectValue placeholder="Country" className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timezone */}
                <div className="relative">
                  <Popover open={activeTimezonePicker === 'main'} onOpenChange={(open) => setActiveTimezonePicker(open ? 'main' : null)}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-base text-left flex items-center justify-between md:h-14 custom-button-dropdown"
                      >
                        <span className="text-gray-400">
                          {formData.timezone
                            ? timezoneOptions.find((o) => o.value === formData.timezone)?.label ?? formData.timezone
                            : 'Timezone'}
                        </span>
                        <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search timezone..." />
                        <CommandList className="max-h-60 overflow-y-auto">
                          {timezoneOptions.map((tz) => (
                            <CommandItem
                              key={tz.value}
                              value={`${tz.value} ${tz.label}`}
                              onSelect={() => {
                                handleInputChange('timezone', tz.value);
                                setActiveTimezonePicker(null);
                              }}
                            >
                              <span>{tz.label}</span>
                              {formData.timezone === tz.value && <Check className="ml-auto" />}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                    className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                  />
                </div> */}

                {/* Category */}
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-base md:h-14 custom-button-dropdown">
                      <SelectValue
                        placeholder="Category"
                        className="text-gray-400"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(categoriesData?.data ?? [])
                        .slice()
                        .sort((a, b) => a.priority - b.priority)
                        .map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time Section */}
                <div className="pt-2 md:pt-1">
                  <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 md:mb-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Start date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="date"
                          placeholder="Event starting date"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                          required
                          className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base text-gray-400 md:h-14"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">End date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="date"
                          placeholder="Event ending date"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                          min={formData.startDate || undefined}
                          required
                          className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base text-gray-400 md:h-14"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Template Fields */}
                  {selectedTemplateId &&
                    templateData?.data?.props &&
                    templateData.data.props.length > 0 && (
                      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Template Fields
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {templateData.data.props
                            .filter(
                              (prop) =>
                                (prop?.prop_name || "").toLowerCase() !==
                                "kidsbirthdaycard",
                            )
                            .map((prop) => {
                              const key = prop.prop_name;
                              const lname = (key || "").toLowerCase();
                              const isDate = lname.includes("date");
                              const isTime = lname.includes("time");
                              const isMessage = lname.includes("message");
                              // Empty prop_name indicates image field based on backend response
                              const isImage = lname.includes("image") || lname.includes("photo") || lname.includes("picture") || key === "";
                              const isNumber = [
                                "age",
                                "count",
                                "number",
                                "qty",
                                "quantity",
                              ].some((h) => lname.includes(h) && !isMessage);
                              const inputType: "text" | "date" | "number" | "time" | "textarea" | "file" = isImage
                                ? "file"
                                : isMessage
                                  ? "textarea"
                                  : isDate
                                    ? "date"
                                    : isTime
                                      ? "time"
                                      : isNumber
                                        ? "number"
                                        : "text";
                              
                              return (
                                <div key={prop.id} className="flex flex-col">
                                  <label className="text-xs text-gray-600 mb-1">
                                    {prop.prop_name || "Image"}
                                    {prop.is_required && (
                                      <span className="text-red-500"> *</span>
                                    )}
                                  </label>
                                  {isImage ? (
                                    <div className="space-y-2">
                                      {templateFields[key] ? (
                                        <div className="relative">
                                          <img
                                            src={templateFields[key]}
                                            alt="Uploaded"
                                            className="w-full h-32 object-cover rounded-lg"
                                          />
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              const s3Key = templateFields[`${key}_s3_key`];
                                              if (s3Key) {
                                                try {
                                                  await deleteS3Object(s3Key);
                                                } catch (error) {
                                                  console.error('Failed to delete template image:', error);
                                                }
                                              }
                                              setTemplateFields((prev) => {
                                                const newFields = { ...prev };
                                                delete newFields[key];
                                                delete newFields[`${key}_s3_key`];
                                                return newFields;
                                              });
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <Input
                                          type="file"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              try {
                                                const { url, key: s3Key } = await uploadImageToS3(file);
                                                setTemplateFields((prev) => ({
                                                  ...prev,
                                                  [key]: url,
                                                  [`${key}_s3_key`]: s3Key,
                                                }));
                                              } catch (error) {
                                                console.error('Failed to upload template image:', error);
                                              }
                                            }
                                          }}
                                        />
                                      )}
                                    </div>
                                  ) : inputType === 'textarea' ? (
                                    <textarea
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
                                      rows={3}
                                      placeholder={prop.prop_name}
                                      value={
                                        templateFields[key] ??
                                        templateDefaults[key] ??
                                        ""
                                      }
                                      onChange={(e) =>
                                        setTemplateFields((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }))
                                      }
                                    />
                                  ) : (
                                    <Input
                                      type={inputType as any}
                                      placeholder={
                                        inputType === "text"
                                          ? prop.prop_name
                                          : undefined
                                      }
                                      value={
                                        templateFields[key] ??
                                        templateDefaults[key] ??
                                        ""
                                      }
                                      onChange={(e) =>
                                        setTemplateFields((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      className="h-10"
                                      step={inputType === 'number' ? 'any' : undefined}
                                      min={inputType === 'number' ? '0' : undefined}
                                      accept={inputType === 'file' ? 'image/*' : undefined}
                                    />
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                  {/* Toggle Options */}
                  <div className="space-y-3 md:space-y-3">
                    {/* Commented out All the day event toggle */}
                    {/* <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        All the day event
                      </span>
                      <button
                        onClick={() => handleToggle("isAllDay")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.isAllDay ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.isAllDay
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div> */}
                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        This Event is Free ?
                      </span>
                      <button
                        onClick={() => handleToggle("isFreeEvent")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.isFreeEvent ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.isFreeEvent
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        This Event is Virtual ?
                      </span>
                      <button
                        onClick={() => handleToggle("isVirtual")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.isVirtual ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.isVirtual
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        Add End Date
                      </span>
                      <button
                        onClick={() => handleToggle("hasEndDate")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.hasEndDate ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.hasEndDate
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div> */}
                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        Multi day event
                      </span>
                      <button
                        onClick={() => handleToggle("isMultiDayEvent")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.isMultiDayEvent
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.isMultiDayEvent
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="pt-4 md:pt-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider md:mb-6">
                    ADVANCED SETTINGS
                  </h3>

                  <div className="space-y-3 md:space-y-3">
                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        Create form for event attendees
                      </span>
                      <button
                        onClick={() => handleToggle("createForm")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.createForm ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.createForm
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        Add likes and comments for this event
                      </span>
                      <button
                        onClick={() => handleToggle("allowComments")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.allowComments
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.allowComments
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">
                        Multimedia support
                      </span>
                      <button
                        onClick={() => handleToggle("multimediaSupport")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.multimediaSupport
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.multimediaSupport
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between comman-box-main-grid">
                      <span className="text-gray-700 text-base">Tickets</span>
                      <button
                        onClick={() => handleToggle("hasTickets")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                          formData.hasTickets ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                            formData.hasTickets
                              ? "translate-x-6 md:translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-6 md:pt-8">
                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base"
                  >
                    {isSubmitting ? "Creating..." : getPrimaryActionLabel()}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={addSession}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                  >
                    <PlusCircle className="w-4 h-4" /> Add session
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  Multi day event sessions
                </h3>

                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div
                      key={session.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Session {index + 1}
                        </h4>
                        <button
                          onClick={() => removeSession(session.id)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <Input
                        value={session.name}
                        onChange={(e) =>
                          updateSession(session.id, { name: e.target.value })
                        }
                        placeholder="Session name"
                        required
                        className="h-12"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="date"
                          value={session.date}
                          onChange={(e) =>
                            updateSession(session.id, { date: e.target.value })
                          }
                          required
                          className="h-12"
                        />
                        <Popover
                          open={activeTimezonePicker === session.id}
                          onOpenChange={(open) =>
                            setActiveTimezonePicker(open ? session.id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-left text-sm outline-none transition-colors hover:border-orange-400 focus:ring-2 focus:ring-orange-500"
                            >
                              <span className="block truncate text-gray-900">
                                {timezoneOptions.find(
                                  (option) => option.value === session.timezone,
                                )?.label ?? session.timezone}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search timezone..." />
                              <CommandList>
                                <CommandEmpty>No timezone found.</CommandEmpty>
                                <CommandGroup>
                                  {timezoneOptions.map((timezone) => (
                                    <CommandItem
                                      key={timezone.value}
                                      value={`${timezone.value} ${timezone.label}`}
                                      onSelect={() => {
                                        updateSession(session.id, {
                                          timezone: timezone.value,
                                        });
                                        setActiveTimezonePicker(null);
                                      }}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="truncate">{timezone.label}</span>
                                      {session.timezone === timezone.value && (
                                        <Check className="ml-2 h-4 w-4 shrink-0" />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="time"
                          value={session.start_time}
                          onChange={(e) =>
                            updateSession(session.id, {
                              start_time: e.target.value,
                            })
                          }
                          required
                          className="h-12"
                        />
                        <Input
                          type="time"
                          value={session.end_time}
                          onChange={(e) =>
                            updateSession(session.id, {
                              end_time: e.target.value,
                            })
                          }
                          className="h-12"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {showSessionsValidation && !areSessionsValid && (
                  <p className="text-sm text-red-500">
                    All session fields are required before you continue.
                  </p>
                )}

                <div className="pt-6 md:pt-8">
                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base"
                  >
                    {isSubmitting ? "Creating..." : getPrimaryActionLabel()}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowTypeMenu((v) => !v)}
                      className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                    >
                      insert new block
                    </button>
                    {showTypeMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-md p-1 z-10">
                        <button
                          onClick={() => {
                            addBlock("input");
                            setShowTypeMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Input field
                        </button>
                        <button
                          onClick={() => {
                            addBlock("textarea");
                            setShowTypeMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Text area
                        </button>
                        <button
                          onClick={() => {
                            addBlock("radio");
                            setShowTypeMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Radio button
                        </button>
                        <button
                          onClick={() => {
                            addBlock("multi");
                            setShowTypeMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Multiple Option
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  Create Event form
                </h3>

                <div className="space-y-4">
                  {attendeeBlocks.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl p-3 border border-gray-200"
                      draggable={dragEnabledFor === b.id}
                      onDragStart={() => setDraggingId(b.id)}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        if (draggingId && draggingId !== b.id)
                          moveBlock(draggingId, b.id);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDragEnabledFor(null);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {b.type === "textarea" ? (
                          <textarea
                            value={b.question}
                            onChange={(e) =>
                              updateBlock(b.id, { question: e.target.value })
                            }
                            placeholder="write your question"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl h-24 outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          />
                        ) : (
                          <input
                            type="text"
                            value={b.question}
                            onChange={(e) =>
                              updateBlock(b.id, { question: e.target.value })
                            }
                            placeholder="write your question"
                            className="flex-1 h-10 px-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        )}
                        {b.type !== "radio" && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="Drag to reorder"
                              onMouseDown={() => setDragEnabledFor(b.id)}
                              className="p-1 text-gray-400 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeBlock(b.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {(b.type === "input" || b.type === "textarea") && <></>}

                      {b.type === "radio" && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="relative w-full max-w-[280px]"
                              draggable={
                                dragEnabledForOption?.blockId === b.id &&
                                dragEnabledForOption?.index === 0
                              }
                              onDragStart={() =>
                                setDraggingOption({ blockId: b.id, index: 0 })
                              }
                              onDragEnter={(e) => {
                                e.preventDefault();
                                if (
                                  draggingOption &&
                                  draggingOption.blockId === b.id &&
                                  draggingOption.index !== 0
                                ) {
                                  moveOption(b.id, draggingOption.index, 0);
                                }
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnd={() => {
                                setDraggingOption(null);
                                setDragEnabledForOption(null);
                              }}
                            >
                              <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={b.options?.[0] || ""}
                                onChange={(e) =>
                                  updateOption(b.id, 0, e.target.value)
                                }
                                placeholder="first answer here"
                                className="w-full h-11 rounded-xl md:rounded-full border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                              />
                              <button
                                type="button"
                                title="Drag option"
                                onMouseDown={() =>
                                  setDragEnabledForOption({
                                    blockId: b.id,
                                    index: 0,
                                  })
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-4 h-4" />
                              </button>
                            </div>
                            <div
                              className="relative w-full max-w-[280px]"
                              draggable={
                                dragEnabledForOption?.blockId === b.id &&
                                dragEnabledForOption?.index === 1
                              }
                              onDragStart={() =>
                                setDraggingOption({ blockId: b.id, index: 1 })
                              }
                              onDragEnter={(e) => {
                                e.preventDefault();
                                if (
                                  draggingOption &&
                                  draggingOption.blockId === b.id &&
                                  draggingOption.index !== 1
                                ) {
                                  moveOption(b.id, draggingOption.index, 1);
                                }
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnd={() => {
                                setDraggingOption(null);
                                setDragEnabledForOption(null);
                              }}
                            >
                              <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="text"
                                value={b.options?.[1] || ""}
                                onChange={(e) =>
                                  updateOption(b.id, 1, e.target.value)
                                }
                                placeholder="Second answer here"
                                className="w-full h-11 rounded-xl md:rounded-full border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                              />
                              <button
                                type="button"
                                title="Drag option"
                                onMouseDown={() =>
                                  setDragEnabledForOption({
                                    blockId: b.id,
                                    index: 1,
                                  })
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pl-2">
                            <button
                              onClick={() => removeBlock(b.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title="Drag to reorder"
                              onMouseDown={() => setDragEnabledFor(b.id)}
                              className="p-1 text-gray-400 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      {b.type === "multi" && (
                        <div className="space-y-2">
                          {(b.options || []).map((opt: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2"
                              draggable={
                                dragEnabledForOption?.blockId === b.id &&
                                dragEnabledForOption?.index === idx
                              }
                              onDragStart={() =>
                                setDraggingOption({ blockId: b.id, index: idx })
                              }
                              onDragEnter={(e) => {
                                e.preventDefault();
                                if (
                                  draggingOption &&
                                  draggingOption.blockId === b.id &&
                                  draggingOption.index !== idx
                                ) {
                                  moveOption(b.id, draggingOption.index, idx);
                                }
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnd={() => {
                                setDraggingOption(null);
                                setDragEnabledForOption(null);
                              }}
                            >
                              <Input
                                value={opt}
                                onChange={(e) =>
                                  updateOption(b.id, idx, e.target.value)
                                }
                                placeholder={`Option ${idx + 1}`}
                                className="flex-1 h-10"
                              />
                              <button
                                type="button"
                                title="Drag option"
                                onMouseDown={() =>
                                  setDragEnabledForOption({
                                    blockId: b.id,
                                    index: idx,
                                  })
                                }
                                className="p-1 text-gray-400 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeOption(b.id, idx)}
                                className="p-2 text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(b.id)}
                            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                          >
                            <PlusCircle className="w-4 h-4" /> Add option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {attendeeBlocks.length === 0 && (
                    <div className="text-gray-500">
                      Use "insert new block" to add your first question.
                    </div>
                  )}
                </div>

                <div className="pt-6 md:pt-8">
                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base"
                  >
                    {isSubmitting ? "Creating..." : getPrimaryActionLabel()}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  Create Tickets
                </h3>

                <div className="relative">
                  <Select
                    value={currency}
                    onValueChange={(v) => {
                      setCurrency(v);
                      setTickets((prev) =>
                        prev.map((ticket) => ({
                          ...ticket,
                          currency_id: v,
                        })),
                      );
                    }}
                  >
                    <SelectTrigger className="w-full h-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-base md:h-14">
                      <SelectValue
                        placeholder="Select currency"
                        className="text-gray-400"
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="px-3 py-2 text-gray-600">
                          Select currency
                        </SelectLabel>
                        {(currenciesData?.data ?? []).map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id}
                            className="py-3"
                          >
                            <span className="flex items-center gap-3">
                              <span>{item.currency}</span>
                              <span className="text-gray-500">({item.symbol})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-white rounded-xl p-3 border border-gray-200"
                    >
                      <div className="md:col-span-4">
                        <Input
                          value={t.name}
                          onChange={(e) =>
                            updateTicket(t.id, { name: e.target.value })
                          }
                          placeholder="Ticket Name"
                          className="h-10"
                        />
                      </div>
                      <div className="md:col-span-3">
                        {t.is_free ? (
                          <div className="h-10 px-3 flex items-center text-gray-700 bg-gray-100 rounded-lg">
                            Free
                          </div>
                        ) : (
                          <Input
                            value={t.price}
                            onChange={(e) =>
                              updateTicket(t.id, { price: e.target.value })
                            }
                            placeholder="Ticket Price"
                            type="number"
                            className="h-10"
                          />
                        )}
                      </div>
                      <div className="md:col-span-3">
                        <Input
                          value={t.quantity}
                          onChange={(e) =>
                            updateTicket(t.id, { quantity: e.target.value })
                          }
                          placeholder="Quantity"
                          type="number"
                          className="h-10"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2 md:pt-0">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <button
                          onClick={() => removeTicket(t.id)}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="md:col-span-12">
                        <Input
                          value={t.description}
                          onChange={(e) =>
                            updateTicket(t.id, { description: e.target.value })
                          }
                          placeholder="Ticket Description"
                          className="h-10"
                        />
                      </div>
                      <div className="md:col-span-12 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center justify-between gap-3 md:gap-4">
                          <span className="text-sm text-gray-700">Is Free</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateTicket(t.id, {
                                is_free: !t.is_free,
                                price: !t.is_free ? "0" : t.price,
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              t.is_free ? "bg-orange-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                t.is_free ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-3 md:gap-4">
                          <span className="text-sm text-gray-700">Is Predefined</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateTicket(t.id, {
                                is_predefined: !t.is_predefined,
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              t.is_predefined ? "bg-orange-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                t.is_predefined ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    onClick={addTicket}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                  >
                    <PlusCircle className="w-4 h-4" /> Create new Ticket
                  </button>
                </div>

                <div className="pt-6 md:pt-8">
                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base"
                  >
                    {isSubmitting ? "Creating..." : getPrimaryActionLabel()}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {isTemplateModalOpen && <TemplateModal />}
    </div>
  );
};

export default CreateEvent;
