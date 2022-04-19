declare type gqlFetchType = <PromiseReturnType>(
  query: string,
  variables?: { [key: string]: any }
) => Promise<PromiseReturnType>;
