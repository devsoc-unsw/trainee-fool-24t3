TODO:
- app.get("/user/events") - Paginated event names, times, and ids
- app.get("/user/societies") - Societies a user is associated with
- app.get("/user/keywords") - Keywords a user is associated with
- app.get("/user/recevents") - Gets unbookmarked events which satisfy certain criteria("Either in the user's society or keywords")
- app.post("/keyword") - Creates a keyword
- app.put("/user/keyword") - Associates a user with a keyword
- app.delete("/user/keyword") - Disassociates a user with a keyword
- app.delete("/society") - Delete a society(should be admin only)

- May also need to make index.ts more modular(make routes/controllers) if time permits.
