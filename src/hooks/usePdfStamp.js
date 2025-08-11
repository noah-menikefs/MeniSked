import { useCallback, useState } from "react";
import moment from "moment";

/**
 * Small hook to manage a PDF timestamp. Not exact-to-click, but refreshed on intent.
 * - Returns current `stamp` and `updateStamp()` to refresh to now.
 * - Default format: YYYY-MM-DD HH:mm
 */
export default function usePdfStamp(format = "YYYY-MM-DD HH:mm") {
  const [stamp, setStamp] = useState(() => moment().format(format));

  const updateStamp = useCallback(() => {
    setStamp(moment().format(format));
  }, [format]);

  return { stamp, updateStamp };
}
