{
  description = "letsimpl.fyi brand: tokens, CSS, Preact components and the brand.letsimpl.fyi showcase";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      forAll = f: nixpkgs.lib.genAttrs systems (s: f nixpkgs.legacyPackages.${s});
    in
    {
      devShells = forAll (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [ nodejs_24 just git nixpkgs-fmt ];
        };
      });
      formatter = forAll (pkgs: pkgs.nixpkgs-fmt);
    };
}
