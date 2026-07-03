import cardStyle from "./ServiceCard.module.scss";

const ServiceCard = ({
  service,
  onEdit,
  onDelete,
}: {
  service: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  console.log("SERVICES:", service);
  return (
    <div className={cardStyle.serviceCard}>
      <div className={cardStyle.imageBox}>
        <img src={service?.imageUrl || "/no_image.png"} alt={service?.name} />
      </div>

      <div className={cardStyle.contentBox}>
        <div className={cardStyle.titleBox}>
          <h2>{service?.name}</h2>
          <p>{service?.estimatedTime || "N/A"}</p>
        </div>

        <div className={cardStyle.priceBox}>
          {service?.plans?.length ? (
            <>
              <h3>
                One-Time: $
                {service.plans.find((p: any) => p.interval === "one-time")
                  ?.price ?? 0}
              </h3>

              <h3>
                Yearly: $
                {service.plans.find((p: any) => p.interval === "year")?.price ??
                  0}
              </h3>
            </>
          ) : (
            <h3>$0</h3>
          )}

          <span>Pricing</span>
        </div>
      </div>

      <div className={cardStyle.actionBox}>
        <button
          className={cardStyle.editBtn}
          onClick={() => onEdit(service.id || service._id)}
        >
          Edit
        </button>

        <button
          className={cardStyle.deleteBtn}
          onClick={() => onDelete(service.id || service._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
