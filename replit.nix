{ pkgs }: {
  deps = [
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.gh
    pkgs.replitPackages.jest
    pkgs.libuuid
  ];
  env = { 
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.libuuid ];
  }; 
}