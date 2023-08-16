import { defineStore } from "pinia";
import { createClient } from "@supabase/supabase-js";
import { useGlobalStore } from "../index";

export const useRequestStore = defineStore("request", () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { isError, loadingState } = useGlobalStore();

  async function request({ url, method, headers, sendData }, option = {}) {
    try {
      const response = await fetch(url, {
        method: method || "GET",
        body: sendData ? JSON.stringify(sendData) : null,
        headers: headers || {
          "content-type": "application/json",
        },
        mode: "cors",
        ...option,
      });
      if (!response.ok) {
        throw new Error(`${response.status}_請求失敗`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  const supabaseRequest = async (func, meta) => {
    try {
      loadingState(true);
      const { data, count = 0, error } = await func(meta);
      if (error) throw error;
      return { data, count };
    } catch (error) {
      if (error) {
        isError({
          showError: true,
          message: error.error_description || error.message,
        });
        return;
      }
    } finally {
      loadingState(false);
    }
  };

  return {
    supabase,
    request,
    supabaseRequest,
  };
});
