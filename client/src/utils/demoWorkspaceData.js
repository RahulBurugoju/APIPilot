export const DEMO_REQUESTS = [
  {
    _id: "demo-1",
    name: "Get User Profile",
    description: "Fetch public sample user profile payload",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users/1",
    queryParams: [],
    headers: [
      { key: "Accept", value: "application/json", enabled: true },
    ],
    body: {
      type: "none",
      content: "",
    },
    auth: {
      type: "none",
    },
  },
  {
    _id: "demo-2",
    name: "Create Post (JSON Body)",
    description: "Simulate creating a new blog resource with JSON payload",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    queryParams: [],
    headers: [
      { key: "Content-Type", value: "application/json", enabled: true },
    ],
    body: {
      type: "json",
      content: JSON.stringify(
        {
          title: "Building APIs with APIpilot",
          body: "APIpilot makes building and testing APIs seamless and fast.",
          userId: 1,
        },
        null,
        2
      ),
    },
    auth: {
      type: "none",
    },
  },
  {
    _id: "demo-3",
    name: "Echo Query & Headers",
    description: "Echo back dynamic query parameters and custom headers",
    method: "GET",
    url: "https://httpbin.org/get",
    queryParams: [
      { key: "version", value: "v1.0", enabled: true },
      { key: "platform", value: "apipilot-sandbox", enabled: true },
    ],
    headers: [
      { key: "X-Sandbox-Client", value: "APIPilot-Web", enabled: true },
    ],
    body: {
      type: "none",
      content: "",
    },
    auth: {
      type: "none",
    },
  },
  {
    _id: "demo-4",
    name: "Simulate HTTP 404",
    description: "Observe clean error status handling and diagnostics",
    method: "GET",
    url: "https://httpbin.org/status/404",
    queryParams: [],
    headers: [],
    body: {
      type: "none",
      content: "",
    },
    auth: {
      type: "none",
    },
  },
];
