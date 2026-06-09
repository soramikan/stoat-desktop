/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare module "*?asset" {
  const assetPath: string;
  export default assetPath;
}
