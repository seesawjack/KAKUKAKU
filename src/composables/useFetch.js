import { useGlobalStore } from "../stores/index";

export function useFetch() {
  const { isError, loadingState } = useGlobalStore();

  const fetchData = async ({ url, method, headers, sendData }, option = {}) => {
    try {
      loadingState(true);
      const response = await fetch(url, {
        method: method || "GET",
        headers: headers || {
          "content-type": "application/json",
        },
        body: sendData ? JSON.stringify(sendData) : null,
        mode: "cors",
        ...option,
      });
      if (!response.ok) {
        throw new Error(`${response.status}_請求失敗`);
      }
      const data = await response.json();
      return data
    } catch (error) {
      isError({
        showError: true,
        message: error,
      });
    } finally {
      loadingState(false);
    }
  };

  return {
    fetchData
  };
}
