export const useServiceCard = (
  service: IServiceData,
  onSelect: (id: string) => void
) => {
  const handleSelect = () => {
    if (service._id) onSelect(service._id);
  };

  const getImage = (url?: string) => {
    return url || "/assets/images/dummy.jpg";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/images/dummy.jpg";
  };

  const getPrices = () => {
    const oneTimePlan = service?.plans?.find(
      (p: any) => p.interval === "one-time"
    );

    const yearlyPlan = service?.plans?.find((p: any) => p.interval === "year");

    return {
      oneTime: oneTimePlan?.price || 0,
      yearly: yearlyPlan?.price || 0,
      monthly: yearlyPlan?.price ? (yearlyPlan.price / 12).toFixed(2) : 0,
    };
  };

  return {
    handleSelect,
    getImage,
    handleImageError,
    getPrices,
  };
};
