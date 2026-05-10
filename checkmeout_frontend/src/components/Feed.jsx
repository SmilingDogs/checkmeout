import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [pins, setPins] = useState(null);
  const [loadedCategoryId, setLoadedCategoryId] = useState();
  const { categoryId } = useParams();
  const activeCategoryId = categoryId ?? null;
  const loading = loadedCategoryId !== activeCategoryId;

  useEffect(() => {
    const query = activeCategoryId ? searchQuery(activeCategoryId) : feedQuery;

    client.fetch(query).then((data) => {
      setPins(data);
      setLoadedCategoryId(activeCategoryId);
    });
  }, [activeCategoryId]);

  if (loading) return <Spinner message="We are adding new ideas to your feed!" />;
  return pins && <MasonryLayout pins={pins} />;
};

export default Feed;
