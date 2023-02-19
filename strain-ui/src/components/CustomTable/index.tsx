import Heading from "./header";
import ItemIs from "./item";
import { TAddParams, TMethodParams } from "../../types";

type ICustomTable = {
  params: TAddParams[];
  addKeyValue: (params: TMethodParams) => void;
};

export default function Table({ params, addKeyValue }: ICustomTable) {
  const savePair = (value: string, position: number, key: string) => {
    const payload = { value, position, key };
    addKeyValue(payload);
  };
  return (
    <>
      <Heading isChecked={true} />
      {params.map(({ key, value, isSelected }, index) => {
        return (
          <ItemIs
            keyName={key}
            value={value}
            position={index}
            isSelected={isSelected}
            savePair={savePair}
          />
        );
      })}
    </>
  );
}
