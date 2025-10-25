import { useCallback, useEffect, useState } from "react";

async function sentHttpRequest(url, config) {
    const response = await fetch(url, config);

    const resData = await response.json();

    if (!response.ok) {
        throw new Error(resData.message || "Something went wrong, failed to send request!");
    }

    return resData;
}

export function useFetch(url, config, initialValue) {
    const [data, setData] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    function clearData() {
        setData(initialValue);
    }

    const sendRequest = useCallback(
        async function sendRequest(data) {
            setIsLoading(true);

            try {
                const resData = await sentHttpRequest(url, { ...config, body: data });
                setData(resData);
            } catch (error) {
                setError(error.message || config?.errorMessage || "Something went wrong!");
            }

            setIsLoading(false);
        },
        [url, config]
    );

    useEffect(() => {
        // execute GET right away, for other requests sendRequest method is exposed so a POST request for example will be executed when needed only
        if (!config || ((config.method === 'GET' || !config.method))) {
            sendRequest();
        }
    }, [sendRequest, config]);

    return {
        data, isLoading, error, sendRequest, clearData
    };
}