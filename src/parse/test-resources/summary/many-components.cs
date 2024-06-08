using Robust.Shared.Audio;
using Robust.Shared.GameStates;
using Robust.Shared.Prototypes;

namespace Content.Shared.Weapons.Melee;

/// <summary>
/// Foo
/// </summary>
[RegisterComponent, NetworkedComponent, AutoGenerateComponentState, AutoGenerateComponentPause]
public sealed partial class SomeOtherComponent : Component
{
    /// <summary>
    /// Bar
    /// </summary>
}

/// <summary>
/// When given to a mob lets them do unarmed attacks, or when given to an item lets someone wield it to do attacks.
/// </summary>
[RegisterComponent, NetworkedComponent, AutoGenerateComponentState, AutoGenerateComponentPause]
public sealed partial class MeleeWeaponComponent : Component
{
    /// <summary>
    /// Does this entity do a disarm on alt attack.
    /// </summary>
    [DataField, ViewVariables(VVAccess.ReadWrite), AutoNetworkedField]
    public bool AltDisarm = true;
}