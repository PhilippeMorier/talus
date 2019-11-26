#include <cppunit/extensions/HelperMacros.h>
#include <openvdb/Exceptions.h>
#include <openvdb/openvdb.h>
#include <openvdb/math/BBox.h>
#include <openvdb/Types.h>
#include <openvdb/math/Transform.h>

using ValueType = bool;
using LeafNodeType = openvdb::tree::LeafNode<ValueType, 3>;
using InternalNodeType1 = openvdb::tree::InternalNode<LeafNodeType, 4>;
using InternalNodeType2 = openvdb::tree::InternalNode<InternalNodeType1, 5>;
using RootNodeType = openvdb::tree::RootNode<InternalNodeType2>;

using openvdb::Index;
using openvdb::Coord;

typedef LeafNodeType LeafType;
typedef InternalNodeType1 InternalNode1;
typedef InternalNodeType2 InternalNode2;
typedef RootNodeType RootNode;

class TestTalus: public CppUnit::TestCase
{
public:
    CPPUNIT_TEST_SUITE(TestTalus);
    
    CPPUNIT_TEST(RootNode_testCoordToKey);
    CPPUNIT_TEST(InternalNode_testCoordToOffset);
    CPPUNIT_TEST(InternalNode_testSetValueOn);
    CPPUNIT_TEST(InternalNode_testStaticConfigValues);
    CPPUNIT_TEST(LeafNode_testCoordToOffset);
    
    CPPUNIT_TEST_SUITE_END();

	void RootNode_testCoordToKey();
    void InternalNode_testCoordToOffset();
    void InternalNode_testSetValueOn();
    void InternalNode_testStaticConfigValues();
    void LeafNode_testCoordToOffset();
};

CPPUNIT_TEST_SUITE_REGISTRATION(TestTalus);

////////////////////////////////////////////////////////////////////////
// RootNode
////////////////////////////////////////////////////////////////////////

void
TestTalus::RootNode_testCoordToKey()
{
	CPPUNIT_ASSERT_EQUAL(Index(0), RootNode::coordToKey(Coord(0, 0, 0)));
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

