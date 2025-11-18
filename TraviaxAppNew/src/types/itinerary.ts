export interface ItineraryOption {
  id: string;
  title: string;
  location?: string;
  duration?: string;
  dateRange?: string;
  heroImage?: string;
  rating?: number;
  price?: number;
  priceDisplay?: string;
}

const buildItemId = (value?: string | number) => {
  if (value === undefined || value === null || value === '') {
    return `generated-${Math.random().toString(36).slice(2)}`;
  }
  return String(value);
};

const formatPriceDisplay = (
  price?: number | string,
  explicitDisplay?: string,
): {numericPrice?: number; label?: string} => {
  if (explicitDisplay && explicitDisplay.trim().length > 0) {
    return {label: explicitDisplay.trim()};
  }

  if (typeof price === 'number' && Number.isFinite(price)) {
    return {numericPrice: price, label: `$${price.toLocaleString()}`};
  }

  const parsed = Number(price);
  if (Number.isFinite(parsed)) {
    return {numericPrice: parsed, label: `$${parsed.toLocaleString()}`};
  }

  return {label: 'Price on request'};
};

export const mapItineraryOptionFromApi = (item: any): ItineraryOption => {
  const priceDisplay =
    item?.priceDisplay ??
    item?.price_display ??
    item?.priceText ??
    item?.price_label ??
    item?.priceLabel;

  const {numericPrice, label} = formatPriceDisplay(item?.price, priceDisplay);

  return {
    id: buildItemId(item?.id ?? item?.title),
    title: item?.title ?? 'Curated Journey',
    location: item?.location ?? item?.country ?? item?.city,
    duration: item?.duration,
    dateRange: item?.dateRange,
    heroImage: item?.heroImage ?? item?.image ?? item?.thumbnail,
    rating:
      typeof item?.rating === 'number' ? item.rating : Number(item?.rating),
    price: numericPrice,
    priceDisplay: label,
  };
};
