import OQL "mo:caffeineai-oql";
import Types "../types/service-queue";

module {
  public func _toRow(self : Types.ServiceStatus) : OQL.Value {
    #text(
      switch self {
        case (#Diterima) "Diterima";
        case (#Dikerjakan) "Dikerjakan";
        case (#Selesai) "Selesai";
        case (#Diambil) "Diambil";
      }
    );
  };
};
