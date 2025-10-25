import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config, signal) {
    const response = await fetch(url, { ...config, signal });

    const resData = await response.json();

    if (!response.ok) {
        throw new Error(resData.message || resData.error || "Something went wrong, failed to send request!");
    }

    return resData;
}

export function useFetch(url, config, initialValue, additionalDeps = []) {
    const [data, setData] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    function clearData() {
        setData(initialValue);
    }

    function clearError() {
        setError(null);
    }

    const sendRequest = useCallback(
        async function sendRequest(data, controller) {
            setIsLoading(true);
            setError(null);

            try {
                const resData = await sendHttpRequest(url, { ...config, body: data }, controller?.signal);
                setData(resData);
            } catch (error) {
                if (error.name === "AbortError") return;
                setError(error.message || config?.errorMessage || "Something went wrong!");
            } finally {
                setIsLoading(false);
            }
        },
        [url, config]
    );

    useEffect(() => {
        if (!url) return; // skip if no URL provided (for conditional fetching)

        const controller = new AbortController();

        // execute GET right away, for other requests sendRequest method is exposed
        if (!config || config.method === "GET" || !config.method) {
            sendRequest(undefined, controller);
        }
        return () => {
            controller.abort();
        };
    }, [sendRequest, config, ...additionalDeps]);

    return {
        data, isLoading, error, sendRequest, clearData, clearError
    };
}