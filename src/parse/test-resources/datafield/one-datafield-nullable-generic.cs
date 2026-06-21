using Robust.Shared.GameStates;

namespace Content.Shared.Sound.Components;

/// <summary>
/// Some summary
/// </summary>
[RegisterComponent]
public sealed partial class SomeComponent {
    [DataField]
    public List<SomeType>? Field;
}
