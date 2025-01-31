import { EngineType } from "@/lib/two-wheeler-loan";
import styles from "../InputContainer/styles.module.css";
import radioGroupStyles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

export const TypeOfVehicleRadioButtonGroup = ({
  value,
  onChange,
}: {
  value: EngineType;
  onChange: (value: EngineType) => void;
}) => {
  const { t } = useTranslation("common");

  interface VehicleTypeOption {
    label: string;
    value: EngineType;
  }

  const vehicleTypes: VehicleTypeOption[] = [
    {
      label: "Petrol/Diesel vehicle (IC)",
      value: EngineType.ICE,
    },
    {
      label: "Electric Vehicle (EV)",
      value: EngineType.EV,
    },
  ];

  return (
    <div
      className={`${styles.input_container} ${styles.input_container__border_none}`}
    >
      <p className={styles.input_field_label}>
        {`${t("add_details_vehicle_type")}*`}
      </p>

      {vehicleTypes.map((item) => {
        return (
          <div
            key={item.value}
            className={radioGroupStyles.radio_button_container}
            onClick={() => onChange(item.value)}
          >
            <p className={radioGroupStyles.radio_button_text}>{item.label}</p>
            <input
              type="radio"
              checked={value == item.value}
              onChange={() => onChange(item.value)}
              name="vehicleType"
              value={item.value}
            />
          </div>
        );
      })}
    </div>
  );
};
