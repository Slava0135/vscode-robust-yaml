// https://github.com/Slava0135/vscode-robust-yaml/issues/18
using Robust.Shared.GameStates;

namespace Content.Shared.Sound.Components;

/// <summary>
/// Some summary
/// </summary>
[RegisterComponent]
public sealed partial class SomeComponent {
    [DataField]
    public SomeType FieldA, FieldB, FieldC;
}
