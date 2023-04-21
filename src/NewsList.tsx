import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import { makeStyles } from "@mui/styles";

interface NewsItem {
  title: string;
  author: string;
  created_at: string;
}

const useStyles = makeStyles({
  title: {
    padding: "8px 0px",
    margin: "8px",
  },
  itemBox: {
    display: "block",
    padding: "8px",
    margin: "8px",
    backgroundColor: "#fff",
    color: "#424242",
    borderColor: "#424242",
    fontSize: "0.875rem",
    fontWeight: "700",
  },
});

const NewsList = () => {
  const classes = useStyles();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [loadingMsg, setLoadingMsg] = useState<string>("Loading...");
  const [error, setError] = useState<string>();
  const dateFormat = "dd MMM yyyy";
  const apiUrl = "https://hn.algolia.com/api/v1/search_by_date";

  const fetchNewsItems = async (pageNum: number) => {
    const url = `${apiUrl}?tags=story&page=${pageNum}`;
    try {
      const response = (await fetch(url)) as Response;
      const data = await response.json();
      await setTotalPageCount(data.nbPages);
      return data.hits as NewsItem[];
    } catch (error) {
      setError("Something went wrong.");
      return [];
    }
  };

  const loadData = async (pageNo: number) => {
    await fetchNewsItems(pageNo)?.then((newNewsItems) => {
      setNewsItems((prevItems) => [...prevItems, ...newNewsItems]);
      setPage(pageNo);
    });
  };

  const loadMore = async () => {
    const newPage = page + 1;
    loadData(newPage);
  };

  useEffect(() => {
    if (page > totalPageCount) {
      setLoadingMsg("Hooray!! you covered all news");
      return;
    }

    page === 0 && loadData(page);

    const interval = setInterval(() => {
      loadMore();
    }, 10000);

    return () => clearInterval(interval);
  }, [page]);

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      <Typography
        align="center"
        variant="h4"
        color="#424242"
        className={classes.title}
      >
        News Feed
      </Typography>
      <div>
        <InfiniteScroll
          dataLength={newsItems.length}
          next={loadMore}
          hasMore={true}
          loader={
            !error && (
              <Typography
                align="center"
                variant="body2"
                color="textSecondary"
                sx={{ py: 2 }}
              >
                {loadingMsg}
              </Typography>
            )
          }
        >
          {!error && newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <Box component="span" className={classes.itemBox} key={index}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.secondary" }}
                    >
                      Author: {item.author}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.secondary" }}
                    >
                      {` ${format(new Date(item.created_at), dateFormat)}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              align="center"
              variant="body2"
              color="textSecondary"
              sx={{ py: 2 }}
            >
              Loading...
            </Typography>
          )}
          {error && (
            <Typography
              align="center"
              variant="body1"
              color="textSecondary"
              sx={{ py: 2, width: "100%" }}
            >
              {error}
            </Typography>
          )}
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default NewsList;
