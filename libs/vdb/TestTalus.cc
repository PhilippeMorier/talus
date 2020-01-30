#include <cppunit/extensions/HelperMacros.h>
#include <openvdb/Exceptions.h>
#include <openvdb/openvdb.h>
#include <openvdb/math/BBox.h>
#include <openvdb/math/Ray.h>
#include <openvdb/Types.h>
#include <openvdb/math/Transform.h>
#include <openvdb/tools/RayIntersector.h>

#define ASSERT_DOUBLES_APPROX_EQUAL(expected, actual) \
    CPPUNIT_ASSERT_DOUBLES_EQUAL((expected), (actual), /*tolerance=*/1.e-6);

using ValueType = bool;
using LeafNodeType = openvdb::tree::LeafNode<ValueType, 3>;
using InternalNodeType1 = openvdb::tree::InternalNode<LeafNodeType, 4>;
using InternalNodeType2 = openvdb::tree::InternalNode<InternalNodeType1, 5>;
using RootNodeType = openvdb::tree::RootNode<InternalNodeType2>;

using openvdb::Index;
using openvdb::Coord;

using namespace openvdb;

typedef LeafNodeType LeafType;
typedef InternalNodeType1 InternalNode1;
typedef InternalNodeType2 InternalNode2;
typedef RootNodeType RootNode;

typedef math::Ray<double> RayT;
typedef RayT::Vec3Type Vec3T;


class TestTalus: public CppUnit::TestCase
{
public:
    CPPUNIT_TEST_SUITE(TestTalus);

    CPPUNIT_TEST(RootNode_testCoordToKey);
    CPPUNIT_TEST(InternalNode_testCoordToOffset);
    CPPUNIT_TEST(InternalNode_testSetValueOn);
    CPPUNIT_TEST(InternalNode_testStaticConfigValues);
    CPPUNIT_TEST(LeafNode_testCoordToOffset);
    CPPUNIT_TEST(LeafNode_testOffsetToLocalCoord);
    CPPUNIT_TEST(VolumeRayIntersector_testMarchingOverOneSingleLeafNode);
    CPPUNIT_TEST(VolumeRayIntersector_testMarchingOverTwoAdjacentLeafNodes);
    CPPUNIT_TEST(Coord_testExpand);
    CPPUNIT_TEST(Ray_testIntersects);

    CPPUNIT_TEST_SUITE_END();

    void RootNode_testCoordToKey();
    void InternalNode_testCoordToOffset();
    void InternalNode_testSetValueOn();
    void InternalNode_testStaticConfigValues();
    void LeafNode_testCoordToOffset();
    void LeafNode_testOffsetToLocalCoord();
    void LeafNode_testOffsetToGlobalCoord();
    void VolumeRayIntersector_testMarchingOverOneSingleLeafNode();
    void VolumeRayIntersector_testMarchingOverTwoAdjacentLeafNodes();
    void Coord_testExpand();
    void Ray_testIntersects();
};

CPPUNIT_TEST_SUITE_REGISTRATION(TestTalus);

////////////////////////////////////////////////////////////////////////
// RootNode
////////////////////////////////////////////////////////////////////////

void
TestTalus::RootNode_testCoordToKey()
{
    // coordToKey() is a private static method, therefore not testable
    // CPPUNIT_ASSERT_EQUAL(Index(0), RootNode::coordToKey(Coord(0, 0, 0)));
}

////////////////////////////////////////////////////////////////////////
// InternalNode
////////////////////////////////////////////////////////////////////////

void
TestTalus::InternalNode_testCoordToOffset()
{
    const Coord origin(-9, -2, -8);
    const bool bg = false;
    InternalNode1 internal(origin, bg, false);

    CPPUNIT_ASSERT_EQUAL(Index(0), internal.coordToOffset(Coord(0, 0, 128)));
    CPPUNIT_ASSERT_EQUAL(Index(15), internal.coordToOffset(Coord(0, 0, 127)));

    CPPUNIT_ASSERT_EQUAL(Index(0), internal.coordToOffset(Coord(0, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(0), internal.coordToOffset(Coord(0, 0, 1)));
    CPPUNIT_ASSERT_EQUAL(Index(0), internal.coordToOffset(Coord(0, 1, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(0), internal.coordToOffset(Coord(1, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(0), internal.coordToOffset(Coord(1, 1, 1)));

    CPPUNIT_ASSERT_EQUAL(Index(15), internal.coordToOffset(Coord(0, 0, 127)));
    CPPUNIT_ASSERT_EQUAL(Index(255), internal.coordToOffset(Coord(0, 127, 127)));
    CPPUNIT_ASSERT_EQUAL(Index(4095), internal.coordToOffset(Coord(127, 127, 127)));

    CPPUNIT_ASSERT_EQUAL(Index(1), internal.coordToOffset(Coord(0, 0, 8)));
    CPPUNIT_ASSERT_EQUAL(Index(2), internal.coordToOffset(Coord(0, 0, 16)));
    CPPUNIT_ASSERT_EQUAL(Index(3), internal.coordToOffset(Coord(0, 0, 24)));
    CPPUNIT_ASSERT_EQUAL(Index(14), internal.coordToOffset(Coord(0, 0, 112)));
    CPPUNIT_ASSERT_EQUAL(Index(15), internal.coordToOffset(Coord(0, 0, 120)));

    CPPUNIT_ASSERT_EQUAL(Index(16), internal.coordToOffset(Coord(0, 8, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(32), internal.coordToOffset(Coord(0, 16, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(48), internal.coordToOffset(Coord(0, 24, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(224), internal.coordToOffset(Coord(0, 112, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(240), internal.coordToOffset(Coord(0, 120, 0)));

    CPPUNIT_ASSERT_EQUAL(Index(256), internal.coordToOffset(Coord(8, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(512), internal.coordToOffset(Coord(16, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(768), internal.coordToOffset(Coord(24, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(3584), internal.coordToOffset(Coord(112, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(3840), internal.coordToOffset(Coord(120, 0, 0)));

    CPPUNIT_ASSERT_EQUAL(Index(16), internal.coordToOffset(Coord(0, 8, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(17), internal.coordToOffset(Coord(0, 8, 8)));
    CPPUNIT_ASSERT_EQUAL(Index(18), internal.coordToOffset(Coord(0, 8, 16)));
    CPPUNIT_ASSERT_EQUAL(Index(19), internal.coordToOffset(Coord(0, 8, 24)));
    CPPUNIT_ASSERT_EQUAL(Index(30), internal.coordToOffset(Coord(0, 8, 112)));
    CPPUNIT_ASSERT_EQUAL(Index(31), internal.coordToOffset(Coord(0, 8, 120)));

    CPPUNIT_ASSERT_EQUAL(Index(256), internal.coordToOffset(Coord(8, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(257), internal.coordToOffset(Coord(8, 0, 8)));
    CPPUNIT_ASSERT_EQUAL(Index(258), internal.coordToOffset(Coord(8, 0, 16)));
    CPPUNIT_ASSERT_EQUAL(Index(259), internal.coordToOffset(Coord(8, 0, 24)));
    CPPUNIT_ASSERT_EQUAL(Index(270), internal.coordToOffset(Coord(8, 0, 112)));
    CPPUNIT_ASSERT_EQUAL(Index(271), internal.coordToOffset(Coord(8, 0, 120)));

    // 57  / 8 = 7  -> 7  x 256 = 1792  \
    // 19  / 8 = 2  -> 2  x 16  = 32     )> 1792 + 32 + 13 = 1837
    // 104 / 8 = 13 -> 13 x 1   = 13    /
    CPPUNIT_ASSERT_EQUAL(Index(1837), internal.coordToOffset(Coord(57, 19, 104)));
}

void
TestTalus::InternalNode_testSetValueOn()
{
    const Coord origin(0, 0, 0);
    const bool bg = false;
    InternalNode1 internal(origin, bg, false);

    internal.setValueOn(Coord(0, 127, 0), true);

    CPPUNIT_ASSERT_EQUAL(true, internal.getValue(Coord(0, 127, 0)));
    CPPUNIT_ASSERT_EQUAL(false, internal.getValue(Coord(0, 0, 0)));
}


void
TestTalus::InternalNode_testStaticConfigValues()
{
    CPPUNIT_ASSERT_EQUAL(Index(3), LeafType::LOG2DIM + 0);
    CPPUNIT_ASSERT_EQUAL(Index(3), LeafType::TOTAL + 0);
    CPPUNIT_ASSERT_EQUAL(Index(8), LeafType::DIM + 0);
    CPPUNIT_ASSERT_EQUAL(Index(512), LeafType::NUM_VALUES + 0);
    CPPUNIT_ASSERT_EQUAL(Index(0), LeafType::LEVEL + 0);
    CPPUNIT_ASSERT_EQUAL(Index(512), LeafType::NUM_VOXELS + 0);

    CPPUNIT_ASSERT_EQUAL(Index(4), InternalNode1::LOG2DIM + 0);
    CPPUNIT_ASSERT_EQUAL(Index(7), InternalNode1::TOTAL + 0);
    CPPUNIT_ASSERT_EQUAL(Index(128), InternalNode1::DIM + 0);
    CPPUNIT_ASSERT_EQUAL(Index(4096), InternalNode1::NUM_VALUES + 0);
    CPPUNIT_ASSERT_EQUAL(Index(1), InternalNode1::LEVEL + 0);
    CPPUNIT_ASSERT_EQUAL(uint64_t(2097152), InternalNode1::NUM_VOXELS + 0);

    CPPUNIT_ASSERT_EQUAL(Index(5), InternalNode2::LOG2DIM + 0);
    CPPUNIT_ASSERT_EQUAL(Index(12), InternalNode2::TOTAL + 0);
    CPPUNIT_ASSERT_EQUAL(Index(4096), InternalNode2::DIM + 0);
    CPPUNIT_ASSERT_EQUAL(Index(32768), InternalNode2::NUM_VALUES + 0);
    CPPUNIT_ASSERT_EQUAL(Index(2), InternalNode2::LEVEL + 0);
    CPPUNIT_ASSERT_EQUAL(uint64_t(68719476736), InternalNode2::NUM_VOXELS + 0);
}

////////////////////////////////////////////////////////////////////////
// LeafNode
////////////////////////////////////////////////////////////////////////

void
TestTalus::LeafNode_testCoordToOffset()
{
    CPPUNIT_ASSERT_EQUAL(Index(0), LeafType::coordToOffset(Coord(0, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(1), LeafType::coordToOffset(Coord(0, 0, 1)));
    CPPUNIT_ASSERT_EQUAL(Index(2), LeafType::coordToOffset(Coord(0, 0, 2)));
    CPPUNIT_ASSERT_EQUAL(Index(3), LeafType::coordToOffset(Coord(0, 0, 3)));
    CPPUNIT_ASSERT_EQUAL(Index(4), LeafType::coordToOffset(Coord(0, 0, 4)));
    CPPUNIT_ASSERT_EQUAL(Index(5), LeafType::coordToOffset(Coord(0, 0, 5)));
    CPPUNIT_ASSERT_EQUAL(Index(6), LeafType::coordToOffset(Coord(0, 0, 6)));
    CPPUNIT_ASSERT_EQUAL(Index(7), LeafType::coordToOffset(Coord(0, 0, 7)));

    CPPUNIT_ASSERT_EQUAL(Index(8), LeafType::coordToOffset(Coord(0, 1, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(9), LeafType::coordToOffset(Coord(0, 1, 1)));
    CPPUNIT_ASSERT_EQUAL(Index(10), LeafType::coordToOffset(Coord(0, 1, 2)));
    CPPUNIT_ASSERT_EQUAL(Index(11), LeafType::coordToOffset(Coord(0, 1, 3)));
    CPPUNIT_ASSERT_EQUAL(Index(12), LeafType::coordToOffset(Coord(0, 1, 4)));
    CPPUNIT_ASSERT_EQUAL(Index(13), LeafType::coordToOffset(Coord(0, 1, 5)));
    CPPUNIT_ASSERT_EQUAL(Index(14), LeafType::coordToOffset(Coord(0, 1, 6)));
    CPPUNIT_ASSERT_EQUAL(Index(15), LeafType::coordToOffset(Coord(0, 1, 7)));

    CPPUNIT_ASSERT_EQUAL(Index(64), LeafType::coordToOffset(Coord(1, 0, 0)));
    CPPUNIT_ASSERT_EQUAL(Index(65), LeafType::coordToOffset(Coord(1, 0, 1)));
    CPPUNIT_ASSERT_EQUAL(Index(66), LeafType::coordToOffset(Coord(1, 0, 2)));
    CPPUNIT_ASSERT_EQUAL(Index(67), LeafType::coordToOffset(Coord(1, 0, 3)));
    CPPUNIT_ASSERT_EQUAL(Index(68), LeafType::coordToOffset(Coord(1, 0, 4)));
    CPPUNIT_ASSERT_EQUAL(Index(69), LeafType::coordToOffset(Coord(1, 0, 5)));
    CPPUNIT_ASSERT_EQUAL(Index(70), LeafType::coordToOffset(Coord(1, 0, 6)));
    CPPUNIT_ASSERT_EQUAL(Index(71), LeafType::coordToOffset(Coord(1, 0, 7)));
}

void
TestTalus::LeafNode_testOffsetToLocalCoord()
{
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 0), LeafType::offsetToLocalCoord(Index(0)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 1), LeafType::offsetToLocalCoord(Index(1)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 2), LeafType::offsetToLocalCoord(Index(2)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 3), LeafType::offsetToLocalCoord(Index(3)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 4), LeafType::offsetToLocalCoord(Index(4)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 5), LeafType::offsetToLocalCoord(Index(5)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 6), LeafType::offsetToLocalCoord(Index(6)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 7), LeafType::offsetToLocalCoord(Index(7)));

    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 0), LeafType::offsetToLocalCoord(Index(0 * LeafType::DIM + 0)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 1, 1), LeafType::offsetToLocalCoord(Index(1 * LeafType::DIM + 1)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 2, 2), LeafType::offsetToLocalCoord(Index(2 * LeafType::DIM + 2)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 3, 3), LeafType::offsetToLocalCoord(Index(3 * LeafType::DIM + 3)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 4, 4), LeafType::offsetToLocalCoord(Index(4 * LeafType::DIM + 4)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 5, 5), LeafType::offsetToLocalCoord(Index(5 * LeafType::DIM + 5)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 6, 6), LeafType::offsetToLocalCoord(Index(6 * LeafType::DIM + 6)));
    CPPUNIT_ASSERT_EQUAL(Coord(0, 7, 7), LeafType::offsetToLocalCoord(Index(7 * LeafType::DIM + 7)));

    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 0), LeafType::offsetToLocalCoord(Index(0 * LeafType::DIM * LeafType::DIM + 0)));
    CPPUNIT_ASSERT_EQUAL(Coord(1, 0, 1), LeafType::offsetToLocalCoord(Index(1 * LeafType::DIM * LeafType::DIM + 1)));
    CPPUNIT_ASSERT_EQUAL(Coord(2, 0, 2), LeafType::offsetToLocalCoord(Index(2 * LeafType::DIM * LeafType::DIM + 2)));
    CPPUNIT_ASSERT_EQUAL(Coord(3, 0, 3), LeafType::offsetToLocalCoord(Index(3 * LeafType::DIM * LeafType::DIM + 3)));
    CPPUNIT_ASSERT_EQUAL(Coord(4, 0, 4), LeafType::offsetToLocalCoord(Index(4 * LeafType::DIM * LeafType::DIM + 4)));
    CPPUNIT_ASSERT_EQUAL(Coord(5, 0, 5), LeafType::offsetToLocalCoord(Index(5 * LeafType::DIM * LeafType::DIM + 5)));
    CPPUNIT_ASSERT_EQUAL(Coord(6, 0, 6), LeafType::offsetToLocalCoord(Index(6 * LeafType::DIM * LeafType::DIM + 6)));
    CPPUNIT_ASSERT_EQUAL(Coord(7, 0, 7), LeafType::offsetToLocalCoord(Index(7 * LeafType::DIM * LeafType::DIM + 7)));

    CPPUNIT_ASSERT_EQUAL(Coord(0, 0, 0), LeafType::offsetToLocalCoord(Index(0 * LeafType::DIM * LeafType::DIM + 0 * LeafType::DIM + 0)));
    CPPUNIT_ASSERT_EQUAL(Coord(1, 1, 1), LeafType::offsetToLocalCoord(Index(1 * LeafType::DIM * LeafType::DIM + 1 * LeafType::DIM + 1)));
    CPPUNIT_ASSERT_EQUAL(Coord(2, 2, 2), LeafType::offsetToLocalCoord(Index(2 * LeafType::DIM * LeafType::DIM + 2 * LeafType::DIM + 2)));
    CPPUNIT_ASSERT_EQUAL(Coord(3, 3, 3), LeafType::offsetToLocalCoord(Index(3 * LeafType::DIM * LeafType::DIM + 3 * LeafType::DIM + 3)));
    CPPUNIT_ASSERT_EQUAL(Coord(4, 4, 4), LeafType::offsetToLocalCoord(Index(4 * LeafType::DIM * LeafType::DIM + 4 * LeafType::DIM + 4)));
    CPPUNIT_ASSERT_EQUAL(Coord(5, 5, 5), LeafType::offsetToLocalCoord(Index(5 * LeafType::DIM * LeafType::DIM + 5 * LeafType::DIM + 5)));
    CPPUNIT_ASSERT_EQUAL(Coord(6, 6, 6), LeafType::offsetToLocalCoord(Index(6 * LeafType::DIM * LeafType::DIM + 6 * LeafType::DIM + 6)));
    CPPUNIT_ASSERT_EQUAL(Coord(7, 7, 7), LeafType::offsetToLocalCoord(Index(7 * LeafType::DIM * LeafType::DIM + 7 * LeafType::DIM + 7)));
}

void
TestTalus::LeafNode_testOffsetToGlobalCoord()
{
    const Coord origin(LeafType::DIM, LeafType::DIM, LeafType::DIM);
    const bool bg = false;
    LeafType leaf(origin, bg, false);

    CPPUNIT_ASSERT_EQUAL(Coord(LeafType::DIM, LeafType::DIM, LeafType::DIM), leaf.offsetToGlobalCoord(Index(0)));
    CPPUNIT_ASSERT_EQUAL(Coord(LeafType::DIM, LeafType::DIM, LeafType::DIM + 1), leaf.offsetToGlobalCoord(Index(1)));
    CPPUNIT_ASSERT_EQUAL(Coord(LeafType::DIM + 1, LeafType::DIM, LeafType::DIM + 1), leaf.offsetToGlobalCoord(Index(LeafType::DIM * LeafType::DIM + 1)));
    CPPUNIT_ASSERT_EQUAL(Coord(LeafType::DIM + 1, LeafType::DIM + 1, LeafType::DIM + 1), leaf.offsetToGlobalCoord(Index(LeafType::DIM * LeafType::DIM + LeafType::DIM + 1)));
}

////////////////////////////////////////////////////////////////////////
// VolumeRayIntersector
////////////////////////////////////////////////////////////////////////

void
TestTalus::VolumeRayIntersector_testMarchingOverOneSingleLeafNode()
{
    FloatGrid grid(0.0f);

    grid.tree().setValue(Coord(0,0,0), 1.0f);
    grid.tree().setValue(Coord(7,7,7), 1.0f);

    const Vec3T dir( 1.0, 0.0, 0.0);
    const Vec3T eye(-1.0, 0.0, 0.0);
    const RayT ray(eye, dir);//ray in index space

    // NodeLevel = 0
    tools::VolumeRayIntersector<FloatGrid, 0> inter(grid);

    CPPUNIT_ASSERT(inter.setIndexRay(ray));

    double t0=0, t1=0;

    CPPUNIT_ASSERT(inter.march(t0, t1));
    ASSERT_DOUBLES_APPROX_EQUAL(1.0, t0);
    ASSERT_DOUBLES_APPROX_EQUAL(9.0, t1);

    CPPUNIT_ASSERT(!inter.march(t0, t1));
}

void
TestTalus::VolumeRayIntersector_testMarchingOverTwoAdjacentLeafNodes()
{
    FloatGrid grid(0.0f);

    grid.tree().setValue(Coord(0,0,0), 1.0f);
    grid.tree().setValue(Coord(8,0,0), 1.0f);
    grid.tree().setValue(Coord(15,7,7), 1.0f);

    const Vec3T dir( 1.0, 0.0, 0.0);
    const Vec3T eye(-1.0, 0.0, 0.0);
    const RayT ray(eye, dir);//ray in index space

    // NodeLevel = 0
    tools::VolumeRayIntersector<FloatGrid, 0> inter(grid);

    CPPUNIT_ASSERT(inter.setIndexRay(ray));

    double t0=0, t1=0;
    CPPUNIT_ASSERT(inter.march(t0, t1));
    ASSERT_DOUBLES_APPROX_EQUAL( 1.0, t0);
    ASSERT_DOUBLES_APPROX_EQUAL(17.0, t1);

    CPPUNIT_ASSERT(!inter.march(t0, t1));
}

////////////////////////////////////////////////////////////////////////
// Coord
////////////////////////////////////////////////////////////////////////

void
TestTalus::Coord_testExpand()
{
    CoordBBox box(3, 0, 0, 20, 5, 20);
    Coord expand(0, 1, 5);
    CoordBBox expandedBox(0, 0, 0, 20, 5, 20);

    box.expand(expand);

    CPPUNIT_ASSERT_EQUAL(box, expandedBox);
}

////////////////////////////////////////////////////////////////////////
// Ray
////////////////////////////////////////////////////////////////////////

void
TestTalus::Ray_testIntersects()
{
    CoordBBox box(3, 0, 0, 20, 5, 20);

    const Vec3T dir( 1.0, 0.0, 0.0);
    const Vec3T eye(-1.0, 0.0, 0.0);
    const RayT ray(eye, dir); // ray in index space

    double t0=0, t1=0;
    CPPUNIT_ASSERT(ray.intersects(box, t0, t1));

    ASSERT_DOUBLES_APPROX_EQUAL(4.0, t0);
    ASSERT_DOUBLES_APPROX_EQUAL(21.0, t1);
}
