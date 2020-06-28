# Start Blender form console in order to see the `print()` messages
# Open this file in the `Scripting` tab of Blender and hit the `Run Script` button in order to execute the script.
# https://docs.blender.org/manual/en/latest/advanced/scripting/addon_tutorial.html#write-the-add-on-simple

# https://docs.blender.org/api/current/mathutils.html?highlight=quaternion#mathutils.Vector
# https://docs.blender.org/api/current/mathutils.html?highlight=to_track_quat#mathutils.Vector.to_track_quat

import bpy

def register():
    print('register')

    curve = bpy.data.curves.new('branches', type='CURVE')
    # https://docs.blender.org/manual/en/latest/modeling/curves/structure.html#bezier
    stem = curve.splines.new('BEZIER')
    # https://docs.blender.org/api/current/bpy.types.BezierSplinePoint.html#bpy.types.BezierSplinePoint

    stem.bezier_points.add(3)
    stem.bezier_points[0].co = (0, 0, 0)
    stem.bezier_points[0].handle_left = (0, 0, -1)
    stem.bezier_points[0].handle_right = (0, 0, 1)
    stem.bezier_points[1].co = (0, 1, 0)
    stem.bezier_points[1].handle_left = (0, 1, -1)
    stem.bezier_points[1].handle_right = (0, 1, 1)
    stem.bezier_points[2].co = (0, 2, 0)
    stem.bezier_points[2].handle_left = (0, 2, -1)
    stem.bezier_points[2].handle_right = (0, 2, 1)
    stem.bezier_points[3].co = (0, 3, 0)
    stem.bezier_points[3].handle_left = (0, 3, -1)
    stem.bezier_points[3].handle_right = (0, 3, 1)

    for ob in bpy.context.selected_objects:
        print(dir(ob))

    # create Object
    curveOB = bpy.data.objects.new('Stem', curve)
    curveOB.location = (0,0,0)

    # attach to scene and validate context
    bpy.context.collection.objects.link(curveOB)

def unregister():
    print('unregister')


# This allows you to run the script directly from Blender's Text editor
# to test the add-on without having to install it.
if __name__ == "__main__":
    register()
