export const formatAmount = (number) => {
  if (number)
    return new Intl.NumberFormat("ja-JP", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }).format(number);
  return 0;
};

export const getStateColor = (state) => {
  let color = "";
  switch (state) {
    case "succeed":
    case "completed":
    case "collected":
    case "active":
    case "verified":
    case "accepted":
    case "done":
    case "buy":
    case "online":
    case "enabled":
    case "confirming":
      color = "green";
      break;
    case "failed":
      color = "magenta";
      break;
    case "errored":
    case "rejected":
    case "disabled":
    case "sell":
    case "inactive":
    case "banned":
    case "cancel":
    case "skipped":
      color = "red";
    break;
    case "waiting":
    case "processing":
    case "confirming":
    case "submitted":
    case "pending":
      color = "orange";
      break;
    case "cancel": 
      color = "default";
      break;
    default:
      color = "blue";
  }
  return color;
};
