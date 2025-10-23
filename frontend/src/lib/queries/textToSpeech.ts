import axios from "axios";

export async function getTextToSpeech(text: string) {

    try {
        let data = JSON.stringify({
            query: `mutation GetTextToSpeech($text: String!) {
                    textToSpeech(text: $text)
                    }`,
            variables: {
                text: text,
            },
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.NEXT_PUBLIC_BACKEND_URL,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };
        
        const res = await axios.request(config);

        if (res.data?.data?.textToSpeech) {
            return res.data.data.textToSpeech;
        }
    } catch (error) {
        console.error(error);
    }
}
