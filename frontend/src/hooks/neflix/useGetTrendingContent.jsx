import { useEffect, useState } from "react";
import { useContentStore } from "../../store/netflix/content";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null);
	const { contentType } = useContentStore();

	useEffect(() => {
		const getTrendingContent = async () => {
			const res = await axios.get(`/api/v1/netflix/${contentType}/trending`);
			setTrendingContent(res.data.content);
		};

		getTrendingContent();
	}, [contentType]);

	return { trendingContent };
};
export default useGetTrendingContent;
