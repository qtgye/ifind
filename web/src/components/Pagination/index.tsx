import { useLocation } from "react-router-dom";
import { useCallback } from "react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { useSearchParams, addURLParams } from "utilities/url";
import { useTranslation } from "translations/index";
import RenderIf from "components/RenderIf";
import { previous, next } from "./translations";



const Pagination = ({ totalPages = 1 }: PaginationProps) => {
  const translate = useTranslation();
  const router = useRouter();
  const { page = 1 } = useSearchParams();
  const { pathname, search } = useLocation();

  const onPaginationPageSelect = useCallback(
    ({ selected }: PageSelectProps) => {
      router.push(addURLParams(pathname + search, { page: selected + 1 }));
    },
    [router, pathname, search]
  );

  return (
    <RenderIf condition={Number(page || 1) <= totalPages && totalPages > 1}>
      <div className="pagination">
        <ReactPaginate
          previousLabel={translate(previous)}
          nextLabel={translate(next)}
          className="pagination__list"
          pageCount={totalPages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          forcePage={Number(page) - 1}
          onPageChange={onPaginationPageSelect}
          disableInitialCallback={true}
        />
      </div>
    </RenderIf>
  );
};

export default Pagination;
