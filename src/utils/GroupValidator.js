export const validateGroupName = (groupName) => {
  if (!groupName.trim()) {
    return "Group name is required.";
  }
  if (groupName.length > 20) {
    return "Group name must not exceed 20 characters.";
  }
  return null;
};

export const validateMembers = (members) => {
  if (members.length === 0) {
    return "Please select members to create a group.";
  }
  if (members.length < 2) {
    return "Select at least 3 members.";
  }
  return null;
};
