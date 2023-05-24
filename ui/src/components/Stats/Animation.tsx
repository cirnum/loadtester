// eslint-disable-next-line import/no-extraneous-dependencies
import AnimatedNumber from "react-animated-number";

export function Animate({ value }: { value: number }) {
  return (
    <AnimatedNumber
      value={value}
      style={{
        fontSize: 20,
      }}
      duration={1000}
      formatValue={(n) => n.toFixed(0)}
      frameStyle={(percentage) =>
        percentage > 20 && percentage < 80 ? { opacity: 0.5 } : {}
      }
    />
  );
}
