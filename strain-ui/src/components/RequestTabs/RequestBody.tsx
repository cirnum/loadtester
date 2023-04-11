import JSONInput from "react-json-ide";
import { useSelector, useDispatch } from "react-redux";
import { setJsonBody } from "../../store/stress/dashboard/actions";
import { getSelectedRequestBody } from "../../store/stress/dashboard/selectors";

export default function RequestBody() {
  const dispatch = useDispatch();
  const requestBody = useSelector(getSelectedRequestBody);
  const verifyData = (event) => {
    if (event.jsObject) {
      dispatch(setJsonBody(event.jsObject));
    }
  };
  return (
    <JSONInput
      id="a_unique_id"
      placeholder={requestBody || {}}
      theme="light_mitsuketa_tribute"
      onKeyPressUpdate
      waitAfterKeyPress={1000}
      onChange={verifyData}
      height="200px"
      width="100%"
      colors={{
        default: "black",
        background: "#edf2f7",
        string: "blue",
        keys: "#800000",
        error: "red",
      }}
      style={{
        body: {
          display: "flex",
          overflowX: "auto",
        },
        outerBox: {
          border: "1px solid #e2e8f0",
        },
        contentBox: {
          flex: "0 0 auto",
        },
      }}
    />
  );
}
