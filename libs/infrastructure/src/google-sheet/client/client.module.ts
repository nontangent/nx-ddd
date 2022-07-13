import { NxModule } from "@nx-ddd/core";
import { GoogleSheetClient } from "./client";

@NxModule({
  providers: [GoogleSheetClient],
})
export class GoogleSheetClientModule { }
