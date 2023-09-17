import { IBM_Plex_Sans } from "next/font/google";
import { GridPattern } from "../components/pattern";

export const font = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});
