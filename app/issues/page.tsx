import prisma from "@/prisma/db";
import { IssueStatus } from "@prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import PageSizeSelect from "../_components/PageSizeSelect";
import Pagination from "../_components/Pagination";
import IssuesToolbar from "./IssuesToolbar";
import IssueTable, { IssueQueryParams, orderByValues } from "./IssueTable";
import { Metadata } from "next";

interface Props {
  searchParams: IssueQueryParams;
}

async function IssuesPage({ searchParams }: Props) {
  // Validate the status query parameter
  const statusList = Object.values(IssueStatus);
  const status = searchParams.status
    ? statusList.includes(searchParams.status)
      ? searchParams.status
      : undefined
    : undefined;

  // Validate the orderBy query parameter
  const orderBy = searchParams.orderBy
    ? orderByValues.includes(searchParams.orderBy)
      ? searchParams.orderBy
      : undefined
    : undefined;

  // Validate the sort query parameter
  const sort = searchParams.sort
    ? searchParams.sort === "asc" || searchParams.sort === "desc"
      ? searchParams.sort
      : undefined
    : undefined;

  // Validate the pageSize query parameter
  const pageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize) > 0
      ? parseInt(searchParams.pageSize)
      : pageSizeOptions[0]
    : pageSizeOptions[0];

  // Fetch Issues from the database
  let page = searchParams.page ? parseInt(searchParams.page) : 1;
  const where = { status: status };
  const issueCount = await prisma.issue.count({ where });
  const pageCount = Math.ceil(issueCount / pageSize);
  page = page > pageCount ? pageCount : page;
  const issues = await prisma.issue.findMany({
    where,
    orderBy: {
      [orderBy || "id"]: sort || "asc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return (
    <Flex direction="column" gap="5">
      <IssuesToolbar />
      <IssueTable issues={issues} searchParams={searchParams} />
      <Grid
        columns={{ initial: "1", sm: "2" }}
        gap="3"
        justify="between"
        align="center"
        className="md:justify-items-end"
      >
        <div className="w-fit justify-self-start">
          <Pagination
            itemCount={issueCount}
            pageSize={pageSize}
            currentPage={page}
          />
        </div>
        <PageSizeSelect pageSize={pageSize} pageSizeOptions={pageSizeOptions} />
      </Grid>
    </Flex>
  );
}

const pageSizeOptions = [5, 10, 15, 20, 25];

export const metadata: Metadata = {
  title: "Issue Tracker | Issues",
  description: "View and manage all project issues",
};

// This page must be dynamically rendered to disable cache
export const dynamic = "force-dynamic";
export default IssuesPage;
