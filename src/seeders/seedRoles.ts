import {
  CommonPermissions,
  StudentPermissions,
  SubAdminPermissions,
  TeacherPermissions,
  UserRoles,
  VisitorPermissions,
} from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';
import { Role } from '@/common/models/roles';

const seedRoles = async () => {
  try {
    const permissions = await Permission.find({});

    if (permissions.length === 0) {
      console.log('Please seed permissions first');
      return;
    }

    const permissionMap = permissions.reduce(
      (map, perm) => {
        map[perm.name] = perm._id;
        return map;
      },
      {} as { [key: string]: any }
    );

    const roles = [
      { name: UserRoles.ADMIN, permissions: Object.values(permissionMap) },
      {
        name: UserRoles.SUB_ADMIN,
        permissions: Object.values(SubAdminPermissions && CommonPermissions).map((perm) => permissionMap[perm]),
      },
      {
        name: UserRoles.VISITOR,
        permissions: Object.values(VisitorPermissions && CommonPermissions).map((perm) => permissionMap[perm]),
      },
      {
        name: UserRoles.STUDENT,
        permissions: Object.values(StudentPermissions && CommonPermissions).map((perm) => permissionMap[perm]),
      },
      {
        name: UserRoles.TEACHER,
        permissions: Object.values(TeacherPermissions && CommonPermissions).map((perm) => permissionMap[perm]),
      },
    ];

    await Promise.all(
      roles.map((role) =>
        Role.findOneAndUpdate(
          { name: role.name },
          { name: role.name, permissions: role.permissions },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    console.log('Roles seeded!');
  } catch (err) {
    console.log(err);
    throw new Error('Something went wrong while seeding roles');
  }
};

export default seedRoles;
