using Robust.Shared.GameStates;

namespace Content.Shared.Sound.Components;

/// <summary>
/// Some summary
/// </summary>
[RegisterComponent]
public sealed partial class ComponentA : SomeBaseClass {
    [DataField]
    public SomeType? SomeField;

    /// <summary>
    /// Some summary
    /// </summary>
    [RegisterComponent]
    public sealed partial class ComponentB : SomeBaseClass {
        [DataField]
        public SomeType? SomeField;
    }
}
