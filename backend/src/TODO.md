TODO:

--- Jared ---
- app.get("/user/events") - Paginated event names, times, and ids
- app.get("/user/societies") - Societies a user is associated with

--- Up 4 Grabs ---
- app.get("/user/recevents") - Gets unbookmarked events which satisfy certain criteria("Either in the user's society or keywords")

--- Vincent ---
- app.get("/user/keywords") - Keywords a user is associated with
- app.post("/keyword") - Creates a keyword
- app.put("/user/keyword") - Associates a user with a keyword
- app.delete("/user/keyword") - Disassociates a user with a keyword

- May also need to make index.ts more modular(make routes/controllers) if time permits.
