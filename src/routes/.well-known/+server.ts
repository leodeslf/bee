import { json } from "@sveltejs/kit";

async function GET() {
  return json({
    associatedApplications: [
      {
        applicationId: "59c6a9d7-1ebb-45ec-8266-43c058f8be84"
      }
    ]
  });
}

export {
  GET,
};
