import Heading from "./header";
import ItemIs from "./item";
import { RequestHeadersAndParamsPayload } from "../../store/stress/dashboard/types";

type ICustomTable = {
  params: RequestHeadersAndParamsPayload[];
  addKeyValue: (params: RequestHeadersAndParamsPayload) => void;
  onCheckClick: (position: number, isChecked: boolean) => void;
};

export default function Table({
  params,
  addKeyValue,
  onCheckClick,
}: ICustomTable) {
  const savePair = (value: string, position: number, key: string) => {
    const payload: RequestHeadersAndParamsPayload = { value, position, key };
    addKeyValue(payload);
  };
  return (
    <>
      <Heading isChecked />
      {params?.map(({ key, value, isChecked }, index) => {
        const keyIndex = index;
        return (
          <ItemIs
            key={keyIndex}
            keyName={key}
            value={value}
            position={index}
            isSelected={isChecked}
            savePair={savePair}
            onCheck={onCheckClick}
          />
        );
      })}
    </>
  );
}
